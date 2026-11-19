
"use client";

import { useEffect, useState,useRef } from "react";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight,LoaderCircle } from "lucide-react";
import { createClient } from "../../lib/supabase/client";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();
  const updatingRef = useRef(false);
  const [cartId,setCartId]=useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message,setMessage]=useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [focused,setFocused]=useState(null);

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user }, error } =
          await supabase.auth.getUser();

        if (error && user) {
          throw error;
        }
        setIsGuest(!user);
        if (!user) {
  const guestCart = JSON.parse(
    localStorage.getItem("guest-cart") || "[]"
  );

  if (guestCart.length === 0) {
    setCart([]);
    return;
  }

  const variantIds = guestCart.map(
    (item) => item.variant_id
  );

  const { data, error: guestError } = await supabase
    .from("product_variants")
    .select(`
      id,
      size,
      stock,
      products (
        id,
        name,
        price,
        image
      )
    `)
    .in("id", variantIds);

      if (guestError) {
        throw guestError;
      }

      const cartProducts = (data ?? []).map((variant) => {

        const product = variant.products;

        const guestItem = guestCart.find(
          (item) => item.variant_id === variant.id
        );

        return {
          id: product.id,
          variant_id: variant.id,
          name: product.name,
          price: product.price,
          size: variant.size,
          stock: variant.stock,
          quantity: guestItem.quantity,
          image: product.image
        };
      });

      setCart(cartProducts);
      return;
    }

        const { data: userCart, error: cartError } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (cartError) {
          throw cartError;
        }

        if (!userCart && user) {
          setCart([]);
          return;
        }
      
        setCartId(userCart.id)
        const { data, error: itemsError } = await supabase
          .from("cart_items")
          .select(`
            variant_id,
            quantity,
            product_variants (
              id,
              size,
              stock,
              products (
                id,
                name,
                price,
                image,
                product_images (
                  image_url,
                  sort_order
                )
              )
            )
          `)
          .eq("cart_id", userCart.id);

        if (itemsError) {
          throw itemsError;
        }
        const cartProducts = (data ?? []).map((item) => {
          const variant = item.product_variants;
          const product = variant.products;

          
          return {
            id: product.id,
            variant_id: variant.id,
            name: product.name,
            price: product.price,
            size: variant.size,
            stock: variant.stock,
            quantity: item.quantity,
            image: product.image
          };
        });

        setCart(cartProducts);
        console.log(cartProducts);

      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setLoaded(true);
      }
      
    }

    checkUser();
  }, []);

  const totalItems = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, product) =>
      total + product.price * product.quantity,
    0
  );

  function formatPrice(price) {
    return new Intl.NumberFormat("el-GR", {
      style: "currency",
      currency: "EUR"
    }).format(price);
  }

  function showMessage(text){
    setMessage(text);
    setTimeout(() => {
      setMessage("")
    }, 2000);
  }

async function changeQuantity(move, item, del = false) {
  if (!item.variant_id || updatingRef.current) {
    return;
  }

  const newQuantity = item.quantity + move;

  if (!del && newQuantity < 0) return;

  if (move > 0 && newQuantity > item.stock) {
    setFocused(item.variant_id);
    showMessage(
      "Έχετε επιλέξει τη μέγιστη ποσότητα για αυτό το προϊόν"
    );
    return;
  }

  updatingRef.current = true;
  setIsUpdating(true);

  try {
    if (isGuest) {
      const guestCart = JSON.parse(
        localStorage.getItem("guest-cart") || "[]"
      );

      let updatedCart;

      if (newQuantity === 0 || del) {
        updatedCart = guestCart.filter(
          (product) => product.variant_id !== item.variant_id
        );
      } else {
        updatedCart = guestCart.map((product) =>
          product.variant_id === item.variant_id
            ? { ...product, quantity: newQuantity }
            : product
        );
      }

      localStorage.setItem(
        "guest-cart",
        JSON.stringify(updatedCart)
      );

    } else {
      if (!cartId) {
        throw new Error("Δεν βρέθηκε το καλάθι του χρήστη");
      }

      if (newQuantity === 0 || del) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("cart_id", cartId)
          .eq("variant_id", item.variant_id);

        if (error) {
          throw error;
        }

      } else {
        const { error } = await supabase
          .from("cart_items")
          .update({
            quantity: newQuantity
          })
          .eq("cart_id", cartId)
          .eq("variant_id", item.variant_id);

        if (error) {
          throw error;
        }
      }
    }

    if (newQuantity === 0 || del) {
      setCart((previous) =>
        previous.filter(
          (product) => product.variant_id !== item.variant_id
        )
      );
    } else {
      setCart((previous) =>
        previous.map((product) =>
          product.variant_id === item.variant_id
            ? { ...product, quantity: newQuantity }
            : product
        )
      );
    }

    window.dispatchEvent(new Event("cartChanged"));

  } catch (error) {
    console.error("Error changing quantity:", error);
    showMessage("Αποτυχία ενημέρωσης ποσότητας");

  } finally {
    updatingRef.current = false;
    setIsUpdating(false);
  }
}

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <div>
          <span className="cart-eyebrow">ESHOP / ΚΑΛΑΘΙ</span>
          <h1>Το καλάθι μου</h1>
          <p>{totalItems} προϊόντα στο καλάθι σου</p>
        </div>

        <Link href="/products" className="cart-back">
          Συνέχεια αγορών <ArrowRight size={17} />
        </Link>
      </div>

      {!loaded ? (
        <div className="loading-container">
          <LoaderCircle size={38} className="loading-spinner" />
          <p>Φόρτωση καλαθιού...</p>
        </div>
      ) : cart.length === 0 ? (
        <div className="cart-empty">
          <ShoppingBag size={52} strokeWidth={1.4} />
          <h2>Το καλάθι σου είναι άδειο</h2>
          <p>Ανακάλυψε προϊόντα και πρόσθεσε όσα σου αρέσουν.</p>

          <Link href="/products" className="cart-shop-button">
            Ανακάλυψε προϊόντα
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            <div className="cart-items-heading">
              <h2>Προϊόντα</h2>
              <span>{totalItems} τεμάχια</span>
            </div>

            {cart.map((product) => (
              <article
                className="cart-item"
                key={product.variant_id}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="cart-item-image"
                />

                <div className="cart-item-info">
                  <h3>{product.name}</h3>

                  {product.size && (
                    <p>Μέγεθος: {product.size}</p>
                  )}

                  <strong>{formatPrice(product.price)}</strong>

                  <button
                    type="button"
                    className="cart-remove"
                    disabled={isUpdating}
                    onClick={()=>changeQuantity(0,product,true)}
                  >
                    <Trash2 size={15} />
                    Αφαίρεση
                  </button>
                </div>

                <div className="cart-item-right">
                  <div className="cart-quantity">
                    <button
                      type="button"
                      aria-label="Μείωση ποσότητας"
                      disabled={isUpdating}
                      onClick={()=>changeQuantity(-1,product)}
                    >
                      <Minus size={15} />
                    </button>

                    <span>{product.quantity}</span>

                    <button
                      type="button"
                      aria-label="Αύξηση ποσότητας"
                      disabled={isUpdating}
                      onClick={()=>changeQuantity(1,product)}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  <div>{product.variant_id === focused && message}</div>

                  <strong>
                    {formatPrice(product.price * product.quantity)}
                  </strong>
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <h2>Σύνοψη παραγγελίας</h2>

            <div className="cart-summary-row">
              <span>Προϊόντα ({totalItems})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="cart-summary-row">
              <span>Μεταφορικά</span>
              <span>Στο checkout</span>
            </div>

            <div className="cart-summary-total">
              <strong>Υποσύνολο</strong>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <button
              className="cart-checkout"
              type="button"
              disabled={isUpdating}
              title="Το checkout δεν έχει υλοποιηθεί ακόμη"
            >
              Ολοκλήρωση αγοράς
              <ArrowRight size={18} />
            </button>

            <p className="cart-checkout-note">
              Η ολοκλήρωση παραγγελίας θα ενεργοποιηθεί όταν
              συνδέσουμε το checkout.
            </p>

            <Link href="/products" className="cart-continue">
              Συνέχεια αγορών
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
