
"use client"
import Link from "next/link";
import {Heart,ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  link,
  sizes,
  isOutOfStock = false,
  initialFavorite = false
}) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const supabase =createClient();
  const [user, setUser] = useState(null);

  useEffect(()=>{
    async function checkUser() {
      const { data: { user },error } = await supabase.auth.getUser();

      if(error&& error.name !== "AuthSessionMissingError"){
        console.error("Auth error:", error.message);
        return;
      }
      if(user){
        setUser(user);
      }else {
        const favorites = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );

        setIsFavorite(favorites.includes(id));
      }
  }
  checkUser();
  },[]);
  
  async function handleFavorites(isFavorite,product_id,user){

    if(user){
      if(isFavorite){
        const {error}=await supabase
          .from("favorites")
          .insert({
            user_id:user.id,
            product_id:product_id
          })

        if(error){
          console.log("error adding favorite",error);
          return;
        }
      }
      else{
        const {error}=await supabase
          .from("favorites")
          .delete()
          .eq("user_id",user.id)
          .eq("product_id",id)

        if(error){
          console.log("error deleting favorite",error);
          return;
        }
      }
    setIsFavorite(isFavorite);  
    }
    else {
      const favorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );

      if (isFavorite) {
        favorites.push(product_id);
      } 
      else {
        const index = favorites.indexOf(product_id);

        if (index !== -1) {
          favorites.splice(index, 1);
        }
      }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    window.dispatchEvent(new Event("favoritesChanged"));

    setIsFavorite(isFavorite);
    }
    
  }

  return (
    <div className="product-card">
      <div
        className="product-image"
        style={{ backgroundImage: `url("${image}")` }}
      >
        <button
          type="button"
          className="favorite-btn"
          onClick={() =>{
            const newFav =!isFavorite;
            handleFavorites(newFav,id,user)
            }
          }
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
        <span>{price} € {originalPrice != null && (
          <span className="original-price">
            {originalPrice} €
          </span>
        )}</span>
        <span className="sizes-flex1">
          {isOutOfStock ? (
            <span>Εξαντλήθηκε</span>
          ) : (
            sizes.map((size) => (
              <span key={size}>{size}</span>
            ))
          )}
        </span>
      </div>
      <div className="add-to-cart"><ShoppingCart size={20} color="white"/>Προσθήκη στο καλάθι</div>
    </div>
  );
}
