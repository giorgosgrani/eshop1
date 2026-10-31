import Image from "next/image";
import Hero from "../components/Hero.jsx"
import CategoriesSection from "../components/CategoriesSection.jsx";
import FeaturedProducts from "../components/FeaturedProducts.jsx";
import BenefitsSection from "../components/BenefitsSection";
import PromotionalBanner from "../components/PromotionalBanner.jsx";

export default function Home() {
  return (
    <main>
      <Hero/>
      <CategoriesSection/>
      <FeaturedProducts/>
      <BenefitsSection/>
      <PromotionalBanner/>
    </main>
  );
}
