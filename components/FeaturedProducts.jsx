
"use client";

import ProductCard from "./ProductCard";
import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createClient } from "../lib/supabase/client";

export default function FeaturedProducts() {
  const carouselRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          price,
          original_price,
          image,
          is_featured,
          product_variants(size, stock)
        `)
        .eq("is_featured", true)
        .eq("is_active", true);

      if (error) {
        console.error("Σφάλμα Supabase:", error.message);
        return;
      }

      const formattedProducts = (data ?? []).map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        originalPrice: product.original_price
          ? Number(product.original_price)
          : null,
        image: product.image,
        link: `/products/${product.slug}`,
        isFeatured: product.is_featured,
        sizes: (product.product_variants ?? [])
          .filter((variant) => variant.stock > 0)
          .map((variant) => variant.size),
      }));

      setProducts(formattedProducts);
    };

    fetchProducts();
  }, []);

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

  return (
    <div className="featuredSection">
      <div className="featured-top">
        <h2>Προτεινόμενα προϊόντα</h2>

        <div className="featured-arrows">
          <button
            type="button"
            className="category-prev"
            onClick={() => moveCarousel(-1)}
            aria-label="Προηγούμενο προϊόν"
          >
            <ArrowLeft size={22} />
          </button>

          <button
            type="button"
            className="category-next"
            onClick={() => moveCarousel(1)}
            aria-label="Επόμενο προϊόν"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>

      <div className="featured-wrapper" ref={carouselRef}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
