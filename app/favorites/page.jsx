"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import ProductCard from "../../components/ProductCard";
import {Heart } from "lucide-react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]); 
  const [loading,setLoading]=useState(true);
  const [userId, setUserId] = useState(null);
  const supabase = createClient();

useEffect(() => {
  let cancelled = false;

  async function loadFav() {
    try {
      const { data: { user }, error: authError } =
        await supabase.auth.getUser();

      if (cancelled) return;

      if (authError && authError.name !== "AuthSessionMissingError") {
        console.error(authError);
        return;
      }

      let favoriteIds = [];

      // 1. Παίρνουμε τα αγαπημένα IDs
      if (user) {
        setUserId(user.id);

        const { data, error } = await supabase
          .from("favorites")
          .select("product_id")
          .eq("user_id", user.id);

        if (cancelled) return;

        if (error) {
          console.error("Error loading favorites:", error);
          return;
        }

        favoriteIds = (data ?? []).map(item => item.product_id);

      } else {
        setUserId(null);

        favoriteIds = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
      }

      if (cancelled) return;

      setFavorites(favoriteIds);

      // 2. Αν δεν υπάρχουν αγαπημένα, δεν κάνουμε query
      if (favoriteIds.length === 0) {
        setProducts([]);
        return;
      }

      // 3. Κοινό query για τα προϊόντα
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories(slug),
          product_variants(id,size, stock),
           product_images(image_url, sort_order)
        `)
        .in("id", favoriteIds)
        .eq("is_active", true);

      if (cancelled) return;

      if (error) {
        console.error("Error loading products:", error);
        return;
      }

      // 4. Μετατροπή δεδομένων για το ProductCard
      const productsShow = (data ?? []).map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        originalPrice:
          product.original_price == null
            ? null
            : Number(product.original_price),
        images: [
          product.image,
            ...(product.product_images ?? [])
              .sort((a, b) => a.sort_order - b.sort_order)
              .map(item => item.image_url)
          ].filter(Boolean),    
        category: product.categories?.slug,
        link: `/products/${product.slug}`,
        sizes: (product.product_variants ?? [])
        .filter((variant) => variant.stock > 0)
        .map((variant) => ({
          id: variant.id,
          size: variant.size
        })),
      }));

      setProducts(productsShow);

    } catch (error) {
      console.error("Error loading favorites:", error);

    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadFav();

  return () => {
    cancelled = true;
  };
}, []);

  if (loading) {
  return (
    <div className="loading-container">
      <LoaderCircle size={38} className="loading-spinner" />
      <p>Φόρτωση αγαπημένων...</p>
    </div>
  );
}
  function removeFavorite(productId) {
    setProducts(prev =>
      prev.filter(product => product.id !== productId)
    );
  }
  return (
    <main>
    {products.length > 0 ? <div className="favorite-container">
    <div className="favorite-grid">
      {products.map((product)=>(
        <ProductCard key={product.id} {...product} initialFavorite={true} userId={userId} onFavoriteRemoved={removeFavorite}/>
      ))}
      
    </div>
    <Link href="/products" className="not-empty-favorite-btn">
         Ανακάλυψε προϊόντα
      </Link></div>:
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