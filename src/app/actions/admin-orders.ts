"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import * as ordersRepo from "@/lib/repo/orders";
import type { OrderStatus } from "@/lib/types";

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  await requireAdmin();
  const order = await ordersRepo.updateOrderStatus(id, status);
  revalidatePath("/admin/orders");
  return order;
}
