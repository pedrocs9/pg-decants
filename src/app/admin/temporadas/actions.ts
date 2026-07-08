'use server';

import { db } from '@/db';
import { seasons } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getSeasons() {
  return db.select().from(seasons).orderBy(seasons.name);
}

export async function createSeason(name: string) {
  await db.insert(seasons).values({ name });
  revalidatePath('/admin/temporadas');
}

export async function deleteSeason(id: number) {
  await db.delete(seasons).where(eq(seasons.id, id));
  revalidatePath('/admin/temporadas');
}