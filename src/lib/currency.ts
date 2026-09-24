export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Multiply price (rupees) by quantity using integer paise math to avoid float drift. */
export function lineTotal(price: number, quantity: number): number {
  return Math.round(price * 100 * quantity) / 100;
}
