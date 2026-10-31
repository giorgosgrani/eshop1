"use client"

import Link from "next/link";
import { useState,useEffect} from "react";

export default function PromotionalBanner() {
const promotions = [
  {
    id: 1,
    title: "Νέα συλλογή",
    description: "Ανακάλυψε τις νέες αφίξεις",
    image: "/images/promo-1.png",
    buttonText: "Δες τη συλλογή",
    buttonLink: "/products",
    isActive: true,
  },
  {
    id: 2,
    title: "Εκπτώσεις έως -40%",
    description: "Μοναδικές προσφορές",
    image: "/images/promo-2.png",
    buttonText: "Δες τις προσφορές",
    buttonLink: "/offers",
    isActive: true,
  },
];
const [currentIndex, setCurrentIndex] = useState(0);

const activePromotions = promotions.filter((promo) => promo.isActive);
const promotion = activePromotions[currentIndex];

  useEffect(()=>{
    const interval = setInterval(()=>{
      setCurrentIndex(c => (c + 1) % activePromotions.length);
    },5000);
    return () => clearInterval(interval);
  },[]);

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