
"use client";

import CategoryCard from "../components/CategoryCard.jsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

export default function CategoriesSection() {
  const carouselRef = useRef(null);

  const categories = [
    {
      id: 1,
      name: "Ρούχα",
      image: "/images/category-clothes.png",
      link: "/products?category=clothes",
    },
    {
      id: 2,
      name: "Παπούτσια",
      image: "/images/category-shoes.png",
      link: "/products?category=shoes",
    },
    {
      id: 3,
      name: "Τσάντες",
      image: "/images/category-bags.png",
      link: "/products?category=bags",
    },
    {
      id: 4,
      name: "Αξεσουάρ",
      image: "/images/category-accessories.png",
      link: "/products?category=accessories",
    },
    {
      id: 5,
      name: "Ρούχα",
      image: "/images/category-clothes.png",
      link: "/products?category=clothes",
    },
    {
      id: 6,
      name: "Παπούτσια",
      image: "/images/category-shoes.png",
      link: "/products?category=shoes",
    },
    {
      id: 7,
      name: "Τσάντες",
      image: "/images/category-bags.png",
      link: "/products?category=bags",
    },
    {
      id: 8,
      name: "Αξεσουάρ",
      image: "/images/category-accessories.png",
      link: "/products?category=accessories",
    },
    {
      id: 9,
      name: "Ρούχα",
      image: "/images/category-clothes.png",
      link: "/products?category=clothes",
    },
    {
      id: 10,
      name: "Παπούτσια",
      image: "/images/category-shoes.png",
      link: "/products?category=shoes",
    },
    {
      id: 11,
      name: "Τσάντες",
      image: "/images/category-bags.png",
      link: "/products?category=bags",
    },
    {
      id: 12,
      name: "Αξεσουάρ",
      image: "/images/category-accessories.png",
      link: "/products?category=accessories",
    },
  ];

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
          <span>ΚΑΤΗΓΟΡΙΕΣ</span>
          <h2>Αγόρασε ανά κατηγορία</h2>
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
            image={category.image}
            link={category.link}
          />
        ))}
      </div>
    </div>
  );
}
