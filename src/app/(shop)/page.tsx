import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HowToOrder } from "@/components/home/HowToOrder";
import { TrustSection } from "@/components/home/TrustSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <TrustSection />
      <HowToOrder />
    </>
  );
}
