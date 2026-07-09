'use server';

import { db } from '@/db';
import { brands, products } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getBrands() {
  const rows = await db
    .select({ id: brands.id, name: brands.name, slug: brands.slug, logoUrl: brands.logoUrl, isFeatured: brands.isFeatured })
    .from(brands)
    .orderBy(brands.name);

  const counts = await db
    .select({ brandId: products.brandId, total: count() })
    .from(products)
    .groupBy(products.brandId);

  const countMap = Object.fromEntries(counts.map((c) => [c.brandId, c.total]));
  return rows.map((b) => ({ ...b, productCount: countMap[b.id] ?? 0 }));
}

export async function createBrand(name: string, slug: string, logoUrl: string, isFeatured: boolean) {
  await db.insert(brands).values({ name, slug, logoUrl: logoUrl || null, isFeatured });
  revalidatePath('/admin/marcas');
}

export async function updateBrand(id: number, name: string, slug: string, logoUrl: string, isFeatured: boolean) {
  await db.update(brands).set({ name, slug, logoUrl: logoUrl || null, isFeatured }).where(eq(brands.id, id));
  revalidatePath('/admin/marcas');
  revalidatePath('/');
}

export async function toggleBrandFeatured(id: number, isFeatured: boolean) {
  await db.update(brands).set({ isFeatured }).where(eq(brands.id, id));
  revalidatePath('/admin/marcas');
  revalidatePath('/');
}

export async function deleteBrand(id: number) {
  await db.delete(brands).where(eq(brands.id, id));
  revalidatePath('/admin/marcas');
}