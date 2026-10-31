"use client"
import Link from "next/link";
import {Heart,ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  link,
  sizes
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="product-card">
      <div
        className="product-image"
        style={{ backgroundImage: `url("${image}")` }}
      >
        <button
          type="button"
          className="favorite-btn"
          onClick={() => setIsFavorite(prev => !prev)}
          aria-label={isFavorite ? "Αφαίρεση από αγαπημένα" : "Προσθήκη στα αγαπημένα"}
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
        <span>{price} €</span>
        <span className="sizes-flex1">
          {(sizes).map((size) => (
            <span key={size}>{size}</span>
          ))}
        </span>
      </div>
      <div className="add-to-cart"><ShoppingCart size={20} color="white"/>Προσθήκη στο καλάθι</div>
    </div>
  );
}