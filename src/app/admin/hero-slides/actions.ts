'use server';

import { db } from '@/db';
import { heroSlides } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getHeroSlides() {
  return db.select().from(heroSlides).orderBy(heroSlides.displayOrder);
}

export async function createHeroSlide(data: {
  imageUrl: string;
  title: string;
  subtitle: string;
  linkUrl: string;
  displayOrder: number;
}) {
  await db.insert(heroSlides).values({
    imageUrl: data.imageUrl,
    title: data.title || null,
    subtitle: data.subtitle || null,
    linkUrl: data.linkUrl || null,
    displayOrder: data.displayOrder,
    isActive: true,
  });
  revalidatePath('/admin/hero-slides');
  revalidatePath('/');
}

export async function toggleHeroSlideActive(id: number, isActive: boolean) {
  await db.update(heroSlides).set({ isActive }).where(eq(heroSlides.id, id));
  revalidatePath('/admin/hero-slides');
  revalidatePath('/');
}

export async function deleteHeroSlide(id: number) {
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
  revalidatePath('/admin/hero-slides');
  revalidatePath('/');
}