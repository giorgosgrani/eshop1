
import { products } from "../../lib/supabase/products";
import ProductCard from "../../components/ProductCard";
import ProductFilters from "../../components/ProductFilters";
import { Suspense } from "react";


export default async function ProductsPage({ searchParams }) {
  const { category, price, size } = await searchParams;
  

// 1. Φιλτράρουμε ΜΟΝΟ την κατηγορία
const categoryProducts = products.filter(
  (product) => !category || product.category === category
);

// 2. Υπολογίζουμε τη μέγιστη τιμή της κατηγορίας
const maxPriceStart = Math.ceil(
  Math.max(0, ...categoryProducts.map((product) => product.price))
);

// 3. ΜΕΤΑ εφαρμόζουμε τα υπόλοιπα φίλτρα
const filteredProducts = categoryProducts.filter((product) => {
  const matchesPrice = !price || product.price <= Number(price);
  const matchesSize =
    !size || size === "all" || product.sizes?.includes(size);

  return matchesPrice && matchesSize;
});
  
 

  return (
    <main className="products-page">
      
        <h1>Τα προϊόντα μας</h1>
        
        
        <div className="productpage-header">
      <p>{filteredProducts.length} προϊόντα</p>
      <select className="filter-select">
          <option value="">Δημοφιλή</option>
          <option value="">Αύξουσα</option>
          <option value="">Φφίνουσα</option>
        </select>
        </div>
      <div className="products-layout">
        <Suspense fallback={<p>Φόρτωση φίλτρων...</p>}>
          <ProductFilters maxPriceStart={maxPriceStart} />
        </Suspense>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>
      </div>
    </main>
  );
}