import { getOrders } from "@/lib/repo/orders";
import { OrderTable } from "@/components/admin/OrderTable";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-foreground">Orders</h1>
      <p className="mb-6 text-sm text-muted">{orders.length} order inquiries received via WhatsApp checkout.</p>
      <OrderTable orders={orders} />
    </div>
  );
}
