"use client"

import Link from "next/link";
import { useState,useEffect} from "react";
import { createClient } from "../lib/supabase/client";

export default function PromotionalBanner() {
const [promotions,setPromotions]=useState([]);
const [currentIndex, setCurrentIndex] = useState(0);
const supabase = createClient();

useEffect(()=>{
  async function loadPromo(){
    const {data,error}= await supabase
      .from("promo_banners")
      .select("*")
      .eq("is_active",true)
      .order("position");

    if(error){
      console.error("error retrieving promo",error);
      return;
    }
    setPromotions(data);  
  }
  loadPromo();
},[]);


const promotion = promotions[currentIndex];

  useEffect(() => {
    if (promotions.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(c => (c + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [promotions.length]);
  if (promotions.length === 0) return null;
  return (
    <section className="promotional-banner">
      <div className="promo-content">
        <h2>{promotion.title}</h2>
        <p>{promotion.description}</p>

        <Link href={promotion.buttonLink}>
          {promotion.buttonText}
        </Link>
      </div>
      
      <button
        type="button"
        className="slideButton"
        onClick={() => {
          setCurrentIndex(c => (c + 1) % activePromotions.length);
        }}
      >
        →
      </button>

      <div
        className="promo-image"
        style={{
          backgroundImage: `url("${promotion.image}")`,
        }}
      />
    </section>
  );
}