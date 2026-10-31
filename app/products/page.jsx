
import { products } from "../../lib/products";
import ProductCard from "../../components/ProductCard";
import ProductFilters from "../../components/ProductFilters";


export default async function ProductsPage({ searchParams }) {
  const { category, price, size } = await searchParams;

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !category || product.category === category;

    const matchesPrice =
      !price || product.price <= Number(price);

    const matchesSize =
      !size || size === "all" || product.sizes?.includes(size);

    return matchesCategory && matchesPrice && matchesSize;
  });

  //console.log(filteredProducts);

     const maxPriceStart = Math.max(
    ...filteredProducts.map(product => product.price)
  );
  
 

  return (
    <main className="products-page">
      <h1>Τα προϊόντα μας</h1>
      <p>{filteredProducts.length} προϊόντα</p>

      <div className="products-layout">
        <ProductFilters key={category ?? "all"} maxPriceStart ={maxPriceStart}/>

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