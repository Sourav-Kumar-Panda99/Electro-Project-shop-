export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[×µ]/g, (c) => (c === "×" ? "x" : "u"))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
