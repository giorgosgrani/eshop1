"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import ProductCard from "../../components/ProductCard";
import {Heart } from "lucide-react";
import Link from "next/link";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]); 
  const supabase = createClient();

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    setFavorites(storedFavorites);
  }, []);

  useEffect(()=>{
    let cancelled = false;
    async function loadFav(){
      

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories(slug),
          product_variants(size, stock)
        `)
        .in("id", favorites)
        .eq("is_active", true);

      if (error) {
        console.log(error);
        return;
      }

      const productsShow = (data ?? []).map((product)=>({
        id:product.id,
        name:product.name,
        price:Number(product.price),
        originalPrice:
        product.original_price == null
          ? null
          : Number(product.original_price),
        image:product.image,
        category: product.categories?.slug,
        link: `/products/${product.slug}`,
        sizes: (product.product_variants ?? [])
      .filter((variant) => variant.stock > 0)
      .map((variant) => variant.size),
      }))

      if (cancelled) return;

      setProducts(productsShow);
    }
    loadFav();

    return () => {
      cancelled = true;
    };
  },[favorites]);

  //console.log(favorites);
  return (
    <main>
    {products.length > 0 ?
    <div className="favorite-grid">
      {products.map((product)=>(
        <ProductCard key={product.id} {...product} initialFavorite={true}/>
      ))}
    </div>:
      <div className="empty-favorite">
  <Heart size={48} strokeWidth={1.3} />

  <h2>Δεν έχεις ακόμη αγαπημένα προϊόντα</h2>

  <p>
    Ανακάλυψε τη συλλογή μας και αποθήκευσε
    τα προϊόντα που σου αρέσουν.
  </p>

  <Link href="/products" className="empty-favorite-btn">
    Ανακάλυψε προϊόντα
  </Link>
</div>
    }
    </main>
  );
}