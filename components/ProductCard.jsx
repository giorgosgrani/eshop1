
"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createClient } from "../lib/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
const EMPTY_CART_ITEMS = [];
export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  images,
  category,
  link,
  sizes,
  isOutOfStock = false,
  initialFavorite = false,
  initialCartItems = EMPTY_CART_ITEMS,
  userId = null,
  onFavoriteRemoved
}) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [currentImage, setCurrentImage] = useState(0);
  const supabase = createClient();
  const [selectedSize, setSelectedSize] = useState(null);
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const updatingRef = useRef(false);

  const [cartQuantities, setCartQuantities] = useState(() =>
    Object.fromEntries(
      initialCartItems.map((item) => [
        item.variant_id,
        item.quantity
      ])
    )
  );

  // Συγχρονισμός ποσοτήτων όταν αλλάζουν τα δεδομένα του server
  useEffect(() => {
    setCartQuantities(
      Object.fromEntries(
        initialCartItems.map((item) => [
          item.variant_id,
          item.quantity
        ])
      )
    );
  }, [initialCartItems]);

  useEffect(() => {
    if (userId) return;

    const favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    setIsFavorite(favorites.includes(id));
  }, [id, userId]);

  async function handleFavorites(isFavorite, product_id) {
    if (userId) {
      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .insert({
            user_id: userId,
            product_id: product_id
          });

        if (error) {
          console.log("error adding favorite", error);
          return;
        }
      } else {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", id);

        if (error) {
          console.log("error deleting favorite", error);
          return;
        }
      }

      setIsFavorite(isFavorite);

      if (!isFavorite) {
        onFavoriteRemoved?.(product_id);
      }

      window.dispatchEvent(new Event("favoritesChanged"));
    } else {
      const favorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );

      if (isFavorite) {
        favorites.push(product_id);
      } else {
        const index = favorites.indexOf(product_id);

        if (index !== -1) {
          favorites.splice(index, 1);
        }
      }

      localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
      );

      if (!isFavorite) {
        onFavoriteRemoved?.(product_id);
      }

      window.dispatchEvent(new Event("favoritesChanged"));
      setIsFavorite(isFavorite);
    }
  }

  function moveImage(move) {
    if (move > 0) {
      if (currentImage === images.length - 1) {
        setCurrentImage(0);
      } else {
        setCurrentImage((x) => x + move);
      }
    } else {
      if (currentImage === 0) {
        setCurrentImage(images.length - 1);
      } else {
        setCurrentImage((x) => x + move);
      }
    }
  }

  // Βρίσκουμε την επιλεγμένη παραλλαγή
  const selectedVariant = sizes.find(
    (variant) => variant.size === selectedSize
  );

  // Βρίσκουμε την ποσότητα στο καλάθι
  const currentQuantity = selectedVariant
    ? (cartQuantities[selectedVariant.id] ?? 0)
    : 0;

  // Εύρεση ή δημιουργία καλαθιού
  async function getCardId() {
    const { data: cart, error } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (cart) {
      return cart.id;
    } else {
      const { data: newCart, error: cartError } = await supabase
        .from("carts")
        .insert({
          user_id: userId
        })
        .select("id")
        .single();

      if (cartError) {
        throw cartError;
      }

      return newCart.id;
    }
  }

  async function addToCart() {
    if (selectedSize === null) {
      showMessage("Επιλέξτε ένα μέγεθος");
      return;
    }

    if (!userId) {
      showMessage("Πρέπει πρώτα να συνδεθείτε");
      return;
    }

    if (!selectedVariant) {
      showMessage("Το μέγεθος δεν βρέθηκε");
      return;
    }

    if (isOutOfStock || selectedVariant.stock < 1) {
      showMessage("Το προϊόν έχει εξαντληθεί");
      return;
    }

    if (updatingRef.current) return;

    updatingRef.current = true;
    setIsUpdating(true);

    try {
      const cartId = await getCardId();

      const { error } = await supabase
        .from("cart_items")
        .insert({
          cart_id: cartId,
          variant_id: selectedVariant.id,
          quantity: 1
        });

      if (error) {
        throw error;
      }

      setCartQuantities((previous) => ({
        ...previous,
        [selectedVariant.id]: 1
      }));

      showMessage("Προστέθηκε στο καλάθι");

    } catch (error) {
      console.error("Error adding to cart:", error);
      showMessage("Αποτυχία προσθήκης στο καλάθι");

    } finally {
      updatingRef.current = false;
      setIsUpdating(false);
    }
  }

  function showMessage(text) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  }

  async function changeQuantity(move) {
    if (!selectedVariant || !userId || updatingRef.current) {
      return;
    }

    const variantId = selectedVariant.id;
    const newQuantity = currentQuantity + move;

    if (newQuantity < 0) return;

    if (newQuantity > selectedVariant.stock) {
      showMessage(
        "Έχετε επιλέξει τη μέγιστη ποσότητα για αυτό το προϊόν"
      );
      return;
    }

    updatingRef.current = true;
    setIsUpdating(true);

    try {
      const cartId = await getCardId();

      if (newQuantity === 0) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("cart_id", cartId)
          .eq("variant_id", variantId);

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
          .eq("variant_id", variantId);

        if (error) {
          throw error;
        }
      }

      setCartQuantities((previous) => ({
        ...previous,
        [variantId]: newQuantity
      }));

    } catch (error) {
      console.error("Error changing quantity:", error);
      showMessage("Αποτυχία ενημέρωσης ποσότητας");

    } finally {
      updatingRef.current = false;
      setIsUpdating(false);
    }
  }

  return (
    <div className="product-card">
      <div
        className="product-image"
        style={{
          backgroundImage: `url("${images[currentImage]}")`
        }}
      >
        <div className="image-arrows">
          <button
            type="button"
            className="image-prev"
            onClick={() => moveImage(-1)}
            aria-label="Προηγούμενη φωτογραφία"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            className="image-next"
            onClick={() => moveImage(1)}
            aria-label="Επόμενη φωτογραφία"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        <button
          type="button"
          className="favorite-btn"
          onClick={() => {
            const newFav = !isFavorite;
            handleFavorites(newFav, id);
          }}
          aria-label={
            isFavorite
              ? "Αφαίρεση από αγαπημένα"
              : "Προσθήκη στα αγαπημένα"
          }
          aria-pressed={isFavorite}
        >
          <Heart
            size={20}
            color={isFavorite ? "#ef4444" : "#111827"}
            fill={isFavorite ? "#ef4444" : "none"}
          />
        </button>
      </div>

      <div className="product-details">
        <span>{name}</span>

        <span>
          {price} €{" "}
          {originalPrice != null && (
            <span className="original-price">
              {originalPrice} €
            </span>
          )}
        </span>

        <span className="sizes-flex1">
          {isOutOfStock ? (
            <span>Εξαντλήθηκε</span>
          ) : (
            sizes.map((size) => (
              <button
                type="button"
                key={size.id}
                className={`size-selector ${
                  selectedSize === size.size ? "active" : ""
                }`}
                onClick={() =>
                  setSelectedSize(
                    selectedSize === size.size
                      ? null
                      : size.size
                  )
                }
              >
                {size.size}
              </button>
            ))
          )}
        </span>

        <span>{message}</span>
      </div>

      {currentQuantity > 0 ? (
        <div className="cart-quantity-controls">
          <button
            type="button"
            onClick={() => changeQuantity(-1)}
            disabled={isUpdating}
            aria-label="Μείωση ποσότητας"
          >
            −
          </button>

          <span>{currentQuantity}</span>

          <button
            type="button"
            onClick={() => changeQuantity(1)}
            disabled={isUpdating}
            aria-label="Αύξηση ποσότητας"
          >
            +
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="add-to-cart"
          onClick={addToCart}
          disabled={isUpdating || isOutOfStock}
        >
          <ShoppingCart size={20} color="white" />
          Προσθήκη στο καλάθι
        </button>
      )}
    </div>
  );
}
