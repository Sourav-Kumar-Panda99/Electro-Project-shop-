import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
