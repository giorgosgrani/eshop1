
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("eshop-cart") || "[]"
      );

      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setCart([]);
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("eshop-cart", JSON.stringify(cart));
    }
  }, [cart, loaded]);

  const updateQuantity = (id, size, amount) => {
    setCart((currentCart) =>
      currentCart.map((product) =>
        product.id === id && product.size === size
          ? {
              ...product,
              quantity: Math.max(1, product.quantity + amount),
            }
          : product
      )
    );
  };

  const removeProduct = (id, size) => {
    setCart((currentCart) =>
      currentCart.filter(
        (product) => !(product.id === id && product.size === size)
      )
    );
  };

  const subtotal = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const formatPrice = (price) =>
    Number(price).toLocaleString("el-GR", {
      style: "currency",
      currency: "EUR",
    });

  if (!loaded) {
    return <main className="cart-page">Φόρτωση καλαθιού...</main>;
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

      {cart.length === 0 ? (
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
                key={`${product.id}-${product.size ?? ""}`}
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
                    onClick={() =>
                      removeProduct(product.id, product.size)
                    }
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
                      disabled={product.quantity <= 1}
                      onClick={() =>
                        updateQuantity(product.id, product.size, -1)
                      }
                    >
                      <Minus size={15} />
                    </button>

                    <span>{product.quantity}</span>

                    <button
                      type="button"
                      aria-label="Αύξηση ποσότητας"
                      onClick={() =>
                        updateQuantity(product.id, product.size, 1)
                      }
                    >
                      <Plus size={15} />
                    </button>
                  </div>

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
              disabled
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
