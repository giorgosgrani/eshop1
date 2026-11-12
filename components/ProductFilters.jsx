
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

const categories = [
  { name: "Όλα", slug: null },
  { name: "Ρούχα", slug: "clothes" },
  { name: "Παπούτσια", slug: "shoes" },
  { name: "Τσάντες", slug: "bags" },
  { name: "Αξεσουάρ", slug: "accessories" },
];

const clothesSizes = ["XS", "S", "M", "L", "XL"];
const shoeSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

export default function ProductFilters({ maxPriceStart = 250,type

 }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category");
  const selectedSize = searchParams.get("size") ?? "all";

  const [openCat, setOpenCat] = useState(false);

  const priceLimit = Math.max(0, Number(maxPriceStart) || 0);
  const urlPrice = searchParams.get("price");

  const parsedPrice =
    urlPrice === null ? priceLimit : Number(urlPrice);

  const selectedPrice = Number.isFinite(parsedPrice)
    ? Math.min(priceLimit, Math.max(0, parsedPrice))
    : priceLimit;

  const [sliderPrice, setSliderPrice] = useState(selectedPrice);

  useEffect(() => {
    setSliderPrice(selectedPrice);
  }, [selectedPrice]);

  const availableSizes =
    selectedCategory === "clothes"
      ? clothesSizes
      : selectedCategory === "shoes"
        ? shoeSizes
        : [];

  const commitPrice = (value) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("price", String(value));

    const query = params.toString();

    router.replace(
      query ? `/${type}?${query}` : `/${type}`,
      { scroll: false }
    );
  };

  const changeSize = (size) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedSize === size) {
      params.delete("size");
    } else {
      params.set("size", size);
    }

    const query = params.toString();

    router.push(
      query ? `/${type}?${query}` : `/${type}`,
      { scroll: false }
    );
  };

  return (
    <aside className="product-filters">

      <button
        type="button"
        className="filters-toggle"
        onClick={() => setOpenCat(!openCat)}
        aria-expanded={openCat}
      >
        Φίλτρα
        {openCat ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
      </button>

      <div className={`filters-content ${openCat ? "filters-open" : ""}`}>

        <div className="filters-categories">
          <h3>Κατηγορίες</h3>

          {categories.map((category) => (
            <Link
              key={category.name}
              href={
                category.slug
                  ? `/${type}?category=${category.slug}`
                  : `/${type}`
              }
              className={
                selectedCategory === category.slug ? "active" : ""
              }
              onClick={() => setOpenCat(false)}
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="price-filter">
          <h3>Μέγιστη τιμή {sliderPrice.toFixed(2)}€</h3>

          <input
            className="price-slider"
            type="range"
            min="0"
            max={priceLimit}
            step="any"
            value={sliderPrice}
            disabled={priceLimit === 0}
            onChange={(e) => {
              setSliderPrice(Number(e.target.value));
            }}
            onPointerUp={(e) => {
              commitPrice(Number(e.currentTarget.value));
            }}
            onKeyUp={(e) => {
              if (
                [
                  "ArrowLeft",
                  "ArrowRight",
                  "ArrowUp",
                  "ArrowDown",
                  "Home",
                  "End",
                  "PageUp",
                  "PageDown",
                ].includes(e.key)
              ) {
                commitPrice(Number(e.currentTarget.value));
              }
            }}
            style={{
              "--progress": `${
                priceLimit > 0
                  ? (sliderPrice / priceLimit) * 100
                  : 0
              }%`,
            }}
            aria-label="Μέγιστη τιμή προϊόντων"
          />
        </div>

        {availableSizes.length > 0 && (
          <div className="size-filter">
            <h3>Μέγεθος</h3>

            <div className="sizes-flex">
              {availableSizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  className={selectedSize === size ? "active" : ""}
                  aria-pressed={selectedSize === size}
                  onClick={() => changeSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
