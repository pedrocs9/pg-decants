'use server';

import { db } from '@/db';
import { shippingConfig } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getShippingConfig() {
  const [config] = await db.select().from(shippingConfig).where(eq(shippingConfig.isActive, true));
  return config ?? null;
}

export async function saveShippingConfig(data: { flatRate: string; freeShippingThreshold: string }) {
  const existing = await getShippingConfig();

  if (existing) {
    await db
      .update(shippingConfig)
      .set({
        flatRate: data.flatRate,
        freeShippingThreshold: data.freeShippingThreshold || null,
      })
      .where(eq(shippingConfig.id, existing.id));
  } else {
    await db.insert(shippingConfig).values({
      flatRate: data.flatRate,
      freeShippingThreshold: data.freeShippingThreshold || null,
      isActive: true,
    });
  }

  revalidatePath('/admin/envio');
  revalidatePath('/checkout');
}