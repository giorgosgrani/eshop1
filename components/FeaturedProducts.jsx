"use client"
import ProductCard from "./ProductCard";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { products } from "../lib/products";

export default function FeaturedProducts(){
  const carouselRef = useRef(null);

    const moveCarousel = (direction) => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const card = carousel.querySelector(".product-card");

    if (!card) return;

    const gap =
      parseFloat(getComputedStyle(carousel).columnGap) || 0;

    const distance = card.getBoundingClientRect().width + gap;

    carousel.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    });
  };

  return(
    <div className="featuredSection">
      <div className="featured-top">
        <h2>Προτεινόμενα προιόντα</h2>
          <div className="featured-arrows">
          <button
            type="button"
            className="category-prev"
            onClick={() => moveCarousel(-1)}
            aria-label="Προηγούμενο προιόν"
          >
            <ArrowLeft size={22} />
          </button>

          <button
            type="button"
            className="category-next"
            onClick={() => moveCarousel(1)}
            aria-label="Επόμενo προιόν"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>

      <div className="featured-wrapper" ref={carouselRef}>
          {products.filter((product) => product.isFeatured).map((product)=>(
            <ProductCard key={product.id} {...product} />
          ))}
      </div>
      

    </div>
  );
}