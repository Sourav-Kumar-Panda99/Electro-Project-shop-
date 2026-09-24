"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import * as productsRepo from "@/lib/repo/products";
import type { ProductInput } from "@/lib/repo/products";

function revalidateShop() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function createProductAction(input: ProductInput) {
  await requireAdmin();
  const product = await productsRepo.createProduct(input);
  revalidateShop();
  return product;
}

export async function updateProductAction(id: string, input: Partial<ProductInput>) {
  await requireAdmin();
  const product = await productsRepo.updateProduct(id, input);
  revalidateShop();
  revalidatePath(`/products/${product.slug}`);
  return product;
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await productsRepo.deleteProduct(id);
  revalidateShop();
}

export async function toggleProductActiveAction(id: string, is_active: boolean) {
  await requireAdmin();
  const product = await productsRepo.updateProduct(id, { is_active });
  revalidateShop();
  return product;
}

export async function toggleProductFeaturedAction(id: string, is_featured: boolean) {
  await requireAdmin();
  const product = await productsRepo.updateProduct(id, { is_featured });
  revalidateShop();
  return product;
}
