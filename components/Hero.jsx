"use client"
import Link from "next/link";
import { useState,useEffect } from "react";

export default function Hero(){
  const [slideCount,setSlideCount] = useState(0);

  const slides = [
  {
    id: 1,
    title: "Νέα Συλλογή",
    subtitle:"Στυλ που",
    subtitle2:"ξεχωριζει",
    description: "Ανακάλυψε τη νέα συλλογή με μοντέρνα ρούχα και αξεσουάρ για κάθε περίσταση.",
    image:'/images/hero-fashion.png',
    buttonText: "Δες την συλλογή",
    buttonLink: "/products",
  },
  {
    id: 2,
    title: "Ειδικές Προσφορές",
    subtitle:"Νέες χαμηλές",
    subtitle2:"τιμές",
    description: "Δες τις προσφορές μας",
    image: "/images/hero-offers.png",
    buttonText: "Δες περισσότερα",
    buttonLink: "/discounts",
  },
];

  useEffect(()=>{
    const interval = setInterval(()=>{
      setSlideCount(c => (c + 1) % slides.length);
    },5000);
    return () => clearInterval(interval);
  },[]);


  return(
  <section className="hero" 
    style={{
      backgroundImage: `url("${slides[slideCount].image}")`
    }}
  >
    <div className="hero-content">

        <span className="hero-label">
          {slides[slideCount].title}
        </span>

        <h1>
          {slides[slideCount].subtitle}
          <br />
          {slides[slideCount].subtitle2}
        </h1>

        <p>
          {slides[slideCount].description}
        </p>

        <div className="hero-buttons">
          <Link href={slides[slideCount].buttonLink} className="hero-btn-primary">
            {slides[slideCount].buttonText} →
          </Link>
        </div>
        <button className="slideButton" 
          onClick={()=>{
            if(slideCount===slides.length-1){
              setSlideCount(0);
            }
            else
            setSlideCount(c=>c+1);
          }}
        >→</button>
      </div>
  </section>
  );
}