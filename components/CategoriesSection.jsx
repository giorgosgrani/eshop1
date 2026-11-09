
"use client";

import CategoryCard from "../components/CategoryCard.jsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef ,useState } from "react";
import { createClient } from "@/lib/supabase/client.js";

export default function CategoriesSection() {
  const carouselRef = useRef(null);
  const [categories,setCategories] = useState([]);
  const supabase = createClient();

  useEffect(()=>{
    async function loadCategories() {
      const{data,error}= await supabase
        .from("categories")
        .select("*")
        .order("id");
    
      if(error){
        console.log("error retrieving categories",error);
        return;
      }

      setCategories(data);
    }
    loadCategories();
  },[]);

  const moveCarousel = (direction) => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const card = carousel.querySelector(".category-card");

    if (!card) return;

    const gap =
      parseFloat(getComputedStyle(carousel).columnGap) || 0;

    const distance = card.getBoundingClientRect().width + gap;

    carousel.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    });
  };

  return (
    <div className="categoriesSection">
      <div className="categories-top">
        <div className="categories-heading">
          <h2>Κατηγορίες</h2>
          <p>Ανακάλυψε τη συλλογή που σου ταιριάζει.</p>
        </div>

        <div className="categories-arrows">
          <button
            type="button"
            className="category-prev"
            onClick={() => moveCarousel(-1)}
            aria-label="Προηγούμενες κατηγορίες"
          >
            <ArrowLeft size={22} />
          </button>

          <button
            type="button"
            className="category-next"
            onClick={() => moveCarousel(1)}
            aria-label="Επόμενες κατηγορίες"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>

      <div className="category-wrapper" ref={carouselRef}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            image={category.image_url}
            link={`/products?category=${category.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
