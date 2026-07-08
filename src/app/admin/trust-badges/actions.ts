'use server';

import { db } from '@/db';
import { trustBadges } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getTrustBadges() {
  return db.select().from(trustBadges).orderBy(trustBadges.displayOrder);
}

export async function createTrustBadge(data: {
  icon: 'perfume' | 'shipping' | 'securePayment' | 'heart' | 'cart';
  title: string;
  subtitle: string;
  displayOrder: number;
}) {
  await db.insert(trustBadges).values({ ...data, subtitle: data.subtitle || null, isActive: true });
  revalidatePath('/admin/trust-badges');
  revalidatePath('/');
}

export async function toggleTrustBadge(id: number, isActive: boolean) {
  await db.update(trustBadges).set({ isActive }).where(eq(trustBadges.id, id));
  revalidatePath('/admin/trust-badges');
  revalidatePath('/');
}

export async function deleteTrustBadge(id: number) {
  await db.delete(trustBadges).where(eq(trustBadges.id, id));
  revalidatePath('/admin/trust-badges');
  revalidatePath('/');
}