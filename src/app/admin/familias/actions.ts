'use server';

import { db } from '@/db';
import { olfactoryFamilies } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getFamilies() {
  return db.select().from(olfactoryFamilies).orderBy(olfactoryFamilies.name);
}

export async function createFamily(name: string) {
  await db.insert(olfactoryFamilies).values({ name });
  revalidatePath('/admin/familias');
}

export async function deleteFamily(id: number) {
  await db.delete(olfactoryFamilies).where(eq(olfactoryFamilies.id, id));
  revalidatePath('/admin/familias');
}