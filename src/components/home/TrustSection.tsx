import { PackageCheck, MessageCircle, Wrench, ListChecks } from "lucide-react";

const ITEMS = [
  { icon: PackageCheck, title: "Wide Component Range", desc: "Microcontrollers, sensors, ICs, tools and more in one catalog." },
  { icon: ListChecks, title: "Simple Ordering Process", desc: "Browse, add to cart, and send your order in a few taps." },
  { icon: MessageCircle, title: "Direct WhatsApp Support", desc: "Talk to us directly to confirm availability and delivery." },
  { icon: Wrench, title: "Project Essentials", desc: "Everything from breadboards to soldering tools for your build." },
];

export function TrustSection() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">Why Shop With Us?</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-background p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
