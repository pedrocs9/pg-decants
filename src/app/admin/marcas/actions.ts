'use server';

import { db } from '@/db';
import { brands } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getBrands() {
  return db.select().from(brands).orderBy(brands.name);
}

export async function createBrand(name: string, slug: string, logoUrl: string, isFeatured: boolean) {
  await db.insert(brands).values({ name, slug, logoUrl: logoUrl || null, isFeatured });
  revalidatePath('/admin/marcas');
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