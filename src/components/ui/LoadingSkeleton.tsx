export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="aspect-square bg-white/5" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 rounded bg-white/5" />
        <div className="h-4 w-3/4 rounded bg-white/10" />
        <div className="h-5 w-1/2 rounded bg-white/10" />
        <div className="h-9 w-full rounded-lg bg-white/5" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 w-full rounded bg-white/5" />
        </td>
      ))}
    </tr>
  );
}
