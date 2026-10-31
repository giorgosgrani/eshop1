
const clothes = [
  ["Oversized Blazer", 79.9, 99.9],
  ["Classic White T-Shirt", 19.9, null],
  ["Slim Fit Jeans", 49.9, 59.9],
  ["Knit Cardigan", 49.9, null],
  ["Cotton Hoodie", 39.9, 49.9],
  ["Linen Shirt", 44.9, null],
  ["Wide Leg Trousers", 54.9, 69.9],
  ["Denim Jacket", 69.9, null],
  ["Basic Black T-Shirt", 17.9, null],
  ["Casual Sweatshirt", 34.9, 44.9],
  ["Summer Linen Dress", 59.9, null],
  ["High Waist Jeans", 52.9, 64.9],
  ["Oversized Shirt", 42.9, null],
  ["Wool Blend Coat", 129.9, 159.9],
  ["Ribbed Tank Top", 14.9, null],
  ["Pleated Skirt", 46.9, 59.9],
  ["Relaxed Fit Joggers", 32.9, null],
  ["Classic Polo Shirt", 29.9, 39.9],
  ["Long Sleeve Top", 24.9, null],
  ["Cargo Pants", 57.9, 69.9],
  ["Knitted Sweater", 54.9, null],
  ["Leather Look Jacket", 89.9, 109.9],
  ["Cotton Shorts", 27.9, null],
  ["Floral Midi Dress", 64.9, 79.9],
  ["Straight Fit Jeans", 48.9, null],
  ["Basic White Shirt", 36.9, 44.9],
  ["Zip Up Hoodie", 45.9, null],
  ["Tailored Trousers", 62.9, 74.9],
  ["Graphic T-Shirt", 22.9, null],
  ["Puffer Jacket", 99.9, 129.9],
  ["Satin Blouse", 49.9, null],
  ["Denim Shorts", 31.9, 39.9],
  ["Striped Sweater", 47.9, null],
  ["Casual Mini Dress", 43.9, 54.9],
  ["Fleece Jacket", 68.9, null],
  ["Classic Chinos", 53.9, 64.9],
  ["Oversized Hoodie", 46.9, null],
  ["Cotton Maxi Dress", 72.9, 89.9],
  ["Turtleneck Sweater", 41.9, null],
  ["Formal Blazer", 109.9, 139.9],
];

const shoes = [
  ["Classic Sneakers", 59.9, null],
  ["Running Sneakers", 79.9, 99.9],
  ["Leather Loafers", 89.9, null],
  ["Canvas Sneakers", 39.9, 49.9],
  ["Chelsea Boots", 109.9, 129.9],
  ["Platform Sneakers", 74.9, null],
  ["Leather Ankle Boots", 119.9, 149.9],
  ["Comfort Sandals", 42.9, null],
  ["White Trainers", 64.9, 79.9],
  ["Suede Loafers", 94.9, null],
  ["Sport Running Shoes", 84.9, 109.9],
  ["Casual Slip Ons", 49.9, null],
  ["High Top Sneakers", 69.9, 89.9],
  ["Classic Ballet Flats", 44.9, null],
  ["Leather Derby Shoes", 104.9, 129.9],
  ["Chunky Sneakers", 89.9, null],
  ["Summer Slides", 29.9, 39.9],
  ["Minimalist Sneakers", 72.9, null],
  ["Hiking Boots", 134.9, 159.9],
  ["Classic Espadrilles", 39.9, null],
  ["Retro Sneakers", 79.9, 99.9],
  ["Leather Sandals", 54.9, null],
  ["Winter Boots", 124.9, 149.9],
  ["Everyday Trainers", 62.9, null],
  ["Premium White Sneakers", 99.9, 119.9],
];

const bags = [
  ["Leather Crossbody Bag", 89.9, 109.9],
  ["Taupe Shoulder Bag", 69.9, null],
  ["Classic Tote Bag", 79.9, 99.9],
  ["Mini Shoulder Bag", 49.9, null],
  ["Structured Handbag", 109.9, 139.9],
  ["Canvas Tote Bag", 24.9, null],
  ["Everyday Crossbody Bag", 59.9, 74.9],
  ["Elegant Clutch Bag", 44.9, null],
  ["Leather Backpack", 119.9, 149.9],
  ["City Shoulder Bag", 74.9, null],
  ["Minimalist Handbag", 84.9, 104.9],
  ["Mini Crossbody Bag", 39.9, null],
  ["Travel Weekend Bag", 129.9, 159.9],
  ["Quilted Shoulder Bag", 94.9, null],
  ["Casual Canvas Backpack", 54.9, 69.9],
  ["Classic Satchel Bag", 99.9, null],
  ["Soft Hobo Bag", 79.9, 99.9],
  ["Compact Belt Bag", 34.9, null],
  ["Premium Leather Tote", 149.9, 179.9],
  ["Small Evening Bag", 64.9, null],
];

const accessories = [
  ["Classic Sunglasses", 34.9, 44.9],
  ["Leather Belt", 29.9, null],
  ["Minimalist Watch", 89.9, 109.9],
  ["Cotton Baseball Cap", 19.9, null],
  ["Silk Look Scarf", 24.9, 34.9],
  ["Gold Tone Bracelet", 27.9, null],
  ["Classic Wallet", 39.9, 49.9],
  ["Silver Tone Necklace", 32.9, null],
  ["Wool Beanie", 17.9, 24.9],
  ["Leather Card Holder", 22.9, null],
  ["Round Sunglasses", 36.9, 46.9],
  ["Elegant Hair Clip", 12.9, null],
  ["Minimalist Earrings", 21.9, 29.9],
  ["Winter Scarf", 26.9, null],
  ["Everyday Bracelet", 18.9, 24.9],
];

const clothesSizes = ["XS", "S", "M", "L", "XL"];
const shoeSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

const createProducts = (items, category, startId, image, sizes) =>
  items.map(([name, price, originalPrice], index) => {
    const id = startId + index;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    return {
      id,
      name,
      slug,
      price,
      originalPrice,
      image,
      category,
      link: `/products/${slug}`,
      isFeatured: [1, 2, 3, 4, 5].includes(id),
      sizes: sizes.filter((size, sizeIndex) =>
        (index + sizeIndex) % 3 !== 0
        ),
    };
  });

export const products = [
  ...createProducts(
    clothes,
    "clothes",
    1,
    "/images/product-blazer.png",
    clothesSizes
  ),

  ...createProducts(
    shoes,
    "shoes",
    41,
    "/images/product-sneakers.png",
    shoeSizes
  ),

  ...createProducts(
    bags,
    "bags",
    66,
    "/images/product-bag.png",
    ["One Size"]
  ),

  ...createProducts(
    accessories,
    "accessories",
    86,
    "/images/product-accessories.png",
    ["One Size"]
  ),
];

