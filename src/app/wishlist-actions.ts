'use server';

import { db } from '@/db';
import { wishlistItems, products, productImages, variants, brands } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function toggleWishlist(productId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión para guardar favoritos.' };
  }

  const [existing] = await db
    .select()
    .from(wishlistItems)
    .where(and(eq(wishlistItems.userId, session.user.id), eq(wishlistItems.productId, productId)));

  if (existing) {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, existing.id));
    revalidatePath('/');
    revalidatePath('/decants');
    revalidatePath('/favoritos');
    return { success: true, isInWishlist: false };
  } else {
    await db.insert(wishlistItems).values({ userId: session.user.id, productId });
    revalidatePath('/');
    revalidatePath('/decants');
    revalidatePath('/favoritos');
    return { success: true, isInWishlist: true };
  }
}

export async function isProductInWishlist(productId: number) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const [existing] = await db
    .select()
    .from(wishlistItems)
    .where(and(eq(wishlistItems.userId, session.user.id), eq(wishlistItems.productId, productId)));

  return !!existing;
}

export async function getUserWishlist() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const items = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      brandName: brands.name,
    })
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(eq(wishlistItems.userId, session.user.id));

  const enriched = await Promise.all(
    items.map(async (p) => {
      const [image] = await db
        .select({ imageUrl: productImages.imageUrl })
        .from(productImages)
        .where(and(eq(productImages.productId, p.id), eq(productImages.isMain, true)))
        .limit(1);

      const [priceRow] = await db
        .select({ minPrice: sql<string>`MIN(${variants.price})` })
        .from(variants)
        .where(eq(variants.productId, p.id));

      return { ...p, image: image?.imageUrl ?? '', minPrice: Number(priceRow?.minPrice ?? 0) };
    })
  );

  return enriched;
}