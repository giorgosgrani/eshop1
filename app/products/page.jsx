
import { createClient } from "../../lib/supabase/server";
import ProductCard from "../../components/ProductCard";
import ProductFilters from "../../components/ProductFilters";
import { Suspense } from "react";
import ProductSort from "../../components/ProductSort";

export default async function ProductsPage({ searchParams }) {
  const { category, price, size ,sort } = await searchParams;

  // 1. Δημιουργούμε τον Supabase client στον server
  const supabase = await createClient();

  // 2. Φέρνουμε τα ενεργά προϊόντα από τη βάση
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(slug),
      product_variants(size, stock)
    `)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching products:", error.message);
    return <p>Πρόβλημα κατά τη φόρτωση προϊόντων.</p>;
  }

  // 3. Προσαρμόζουμε τα δεδομένα στο ProductCard
  const products = (data ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    originalPrice:
      product.original_price == null
        ? null
        : Number(product.original_price),
    image: product.image,
    category: product.categories?.slug,
    link: `/products/${product.slug}`,
    isFeatured: product.is_featured,
    sizes: (product.product_variants ?? [])
      .filter((variant) => variant.stock > 0)
      .map((variant) => variant.size),
    isOutOfStock: (product.product_variants ?? [])
      .every((variant) => variant.stock === 0),  
  }));

  // 4. Φιλτράρουμε πρώτα την κατηγορία
  const categoryProducts = products.filter(
    (product) => !category || product.category === category
  );

  // 5. Βρίσκουμε τη μέγιστη τιμή της κατηγορίας
  const maxPriceStart = Math.ceil(
    Math.max(0, ...categoryProducts.map((product) => product.price))
  );

  // 6. Εφαρμόζουμε τα υπόλοιπα φίλτρα
  const filteredProducts = categoryProducts.filter((product) => {
    const matchesPrice =
      !price || product.price <= Number(price);

    const matchesSize =
      !size || size === "all" || product.sizes.includes(size);

    return matchesPrice && matchesSize;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "asc") return a.price - b.price;
    if (sort === "desc") return b.price - a.price;
    return 0;
  });

  return (
    <main className="products-page">
      <h1>Τα προϊόντα μας</h1>

      <div className="productpage-header">
        <p>{filteredProducts.length} προϊόντα</p>

        <Suspense fallback={null}>
          <ProductSort />
        </Suspense>
      </div>

      <div className="products-layout">
        <Suspense fallback={<p>Φόρτωση φίλτρων...</p>}>
          <ProductFilters maxPriceStart={maxPriceStart} />
        </Suspense>

        <div className="products-grid">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </main>
  );
}
