'use server';

import { db } from '@/db';
import { topBarMessages, animatedBannerMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// ---- TopBar ----
export async function getTopBarMessages() {
  return db.select().from(topBarMessages).orderBy(topBarMessages.displayOrder);
}

export async function createTopBarMessage(message: string, displayOrder: number) {
  await db.insert(topBarMessages).values({ message, displayOrder, isActive: true });
  revalidatePath('/admin/mensajes');
  revalidatePath('/');
}

export async function toggleTopBarMessage(id: number, isActive: boolean) {
  await db.update(topBarMessages).set({ isActive }).where(eq(topBarMessages.id, id));
  revalidatePath('/admin/mensajes');
  revalidatePath('/');
}

export async function deleteTopBarMessage(id: number) {
  await db.delete(topBarMessages).where(eq(topBarMessages.id, id));
  revalidatePath('/admin/mensajes');
  revalidatePath('/');
}

// ---- Animated Banner ----
export async function getBannerMessages() {
  return db.select().from(animatedBannerMessages).orderBy(animatedBannerMessages.displayOrder);
}

export async function createBannerMessage(message: string, displayOrder: number) {
  await db.insert(animatedBannerMessages).values({ message, displayOrder, isActive: true });
  revalidatePath('/admin/mensajes');
  revalidatePath('/');
}

export async function toggleBannerMessage(id: number, isActive: boolean) {
  await db.update(animatedBannerMessages).set({ isActive }).where(eq(animatedBannerMessages.id, id));
  revalidatePath('/admin/mensajes');
  revalidatePath('/');
}

export async function deleteBannerMessage(id: number) {
  await db.delete(animatedBannerMessages).where(eq(animatedBannerMessages.id, id));
  revalidatePath('/admin/mensajes');
  revalidatePath('/');
}