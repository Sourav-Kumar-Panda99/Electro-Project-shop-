import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { CartHydration } from "@/components/cart/CartHydration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Electro Project Items | Electronic Components & Project Essentials",
  description:
    "Shop electronic components, modules, tools, wires, ICs, breadboards and project essentials. Browse products and order directly through WhatsApp.",
  openGraph: {
    title: "Electro Project Items",
    description:
      "Components, tools, modules and project essentials — browse and order directly through WhatsApp.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <CartHydration />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
