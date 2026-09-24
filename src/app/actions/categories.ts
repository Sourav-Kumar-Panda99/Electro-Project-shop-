"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import * as categoriesRepo from "@/lib/repo/categories";

function revalidateShop() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
}

export async function createCategoryAction(name: string, icon?: string) {
  await requireAdmin();
  const category = await categoriesRepo.createCategory(name, icon);
  revalidateShop();
  return category;
}

export async function updateCategoryAction(id: string, name: string, icon?: string) {
  await requireAdmin();
  const category = await categoriesRepo.updateCategory(id, { name, icon });
  revalidateShop();
  return category;
}

export async function deleteCategoryAction(id: string, reassignToId?: string) {
  await requireAdmin();

  if (reassignToId) {
    await categoriesRepo.reassignCategoryProducts(id, reassignToId);
  }

  const result = await categoriesRepo.deleteCategory(id);
  revalidateShop();
  return result;
}
