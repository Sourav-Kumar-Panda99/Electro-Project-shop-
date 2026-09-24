import { Search, ShoppingCart, MessageCircle } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Browse Components", desc: "Search and filter through the full catalog by category." },
  { icon: ShoppingCart, title: "Add Items to Cart", desc: "Pick quantities and add as many different products as you need." },
  { icon: MessageCircle, title: "Send Order on WhatsApp", desc: "Enter your details and confirm the order directly with us on WhatsApp." },
];

export function HowToOrder() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">How to Order</h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted">
        No accounts, no payment gateways — just a simple three-step flow.
      </p>

      <div className="relative mt-12 grid gap-8 sm:grid-cols-3">
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-border sm:block" />
        {STEPS.map((step, i) => (
          <div key={step.title} className="relative flex flex-col items-center gap-3 text-center">
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-surface-elevated text-primary shadow-lg shadow-primary/10">
              <step.icon className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-black">
                {i + 1}
              </span>
            </div>
            <h3 className="font-semibold text-foreground">{step.title}</h3>
            <p className="max-w-xs text-sm text-muted">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
