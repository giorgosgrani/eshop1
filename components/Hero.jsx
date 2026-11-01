"use client"
import Link from "next/link";
import { useState,useEffect } from "react";
import { createClient } from "../lib/supabase/client";

export default function Hero(){
  const [slideCount,setSlideCount] = useState(0);
  const [slides,setSlides]=useState([]);
  const supabase = createClient();

  useEffect(()=>{
    async function loadHero(){
      const {data,error} = await supabase
        .from("hero_slides")
        .select("*")
        .eq("is_active",true)
        .order("position");

      if(error){
        console.error("error retrieving hero data",error);
        return;
      }
      setSlides(data);  
    }
    loadHero();
  },[]);

  useEffect(() => {
  if (slides.length === 0) return;

  const interval = setInterval(() => {
    setSlideCount(c => (c + 1) % slides.length);
  }, 5000);

  return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;
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
          <Link href={slides[slideCount].button_link} className="hero-btn-primary">
            {slides[slideCount].button_text} →
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