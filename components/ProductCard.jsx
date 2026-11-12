
"use client"
import Link from "next/link";
import {Heart,ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  userId = null,
  onFavoriteRemoved
}) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [currentImage, setCurrentImage] = useState(0);
  const supabase =createClient();
  const [selectedSize,setSelectedSize]=useState(null);
  const[message,setMessage]=useState("");

  useEffect(() => {
    if (userId) return;

    const favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    setIsFavorite(favorites.includes(id));
  }, [id, userId]);
  
  async function handleFavorites(isFavorite,product_id){

    if(userId){
      if(isFavorite){
        const {error}=await supabase
          .from("favorites")
          .insert({
            user_id:userId,
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
          .eq("user_id",userId)
          .eq("product_id",id)

        if(error){
          console.log("error deleting favorite",error);
          return;
        }
      }
    setIsFavorite(isFavorite);
    
    

    if (!isFavorite) {
      onFavoriteRemoved?.(product_id);
    }  
    window.dispatchEvent(new Event("favoritesChanged"));
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
    
      if (!isFavorite) {
      onFavoriteRemoved?.(product_id);
    } 
    window.dispatchEvent(new Event("favoritesChanged")); 
    setIsFavorite(isFavorite);
    }
    
  }
  function moveImage(move){
    if(move>0){
      if(currentImage === images.length-1){
        setCurrentImage(0);
      }
      else{
        setCurrentImage(x=>x+move)
      }
    }
    else{
      if(currentImage===0){
        setCurrentImage(images.length-1);
      }
      else{
        setCurrentImage(x=>x+move)
      }
    }
  }
  function addToCart(){
    if(selectedSize===null){
      showMessage("Επιλέξτε ένα μέγεθος")
    }
  }

  function showMessage(text){
    setMessage(text);
    setTimeout(()=>{setMessage("")},2000);

  }

  return (
    <div className="product-card">
      <div
        className="product-image"
        style={{ backgroundImage: `url("${images[currentImage]}")` }}
      >
                <div className="image-arrows">
          <button
            type="button"
            className="image-prev"
            onClick ={()=>moveImage(-1)}
            aria-label="Προηγούμενη φωτογραφία"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            className="image-next"
            onClick ={()=>moveImage(1)}
            aria-label="Επόμενη φωτογραφία"
          >
            <ChevronRight size={22} />
          </button>
        </div>
        <button
          type="button"
          className="favorite-btn"
          onClick={() =>{
            const newFav =!isFavorite;
            handleFavorites(newFav,id)
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
              <button 
               key={size.id}
               className= {`size-selector ${selectedSize === size.size?"active":""}`}
               onClick={()=>setSelectedSize(selectedSize===size.size?null:size.size)}
               >{size.size}</button>
            ))
          )}
        </span>
        <span>{message}</span>
      </div>
      
      <div className="add-to-cart"
        onClick={addToCart}
      ><ShoppingCart size={20} color="white"/>Προσθήκη στο καλάθι</div>
    </div>
  );
}
