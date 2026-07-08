'use server';

import { db } from '@/db';
import { products, productImages, variants, brands } from '@/db/schema';
import { eq, and, ilike, sql, or } from 'drizzle-orm';

export async function searchProducts(query: string) {
  if (query.trim().length < 2) return [];

  const results = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      brandName: brands.name,
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(
      and(
        eq(products.isActive, true),
        or(ilike(products.name, `%${query}%`), ilike(brands.name, `%${query}%`))
      )
    )
    .limit(6);

  const enriched = await Promise.all(
    results.map(async (p) => {
      const [image] = await db
        .select({ imageUrl: productImages.imageUrl })
        .from(productImages)
        .where(and(eq(productImages.productId, p.id), eq(productImages.isMain, true)))
        .limit(1);

      const [priceRow] = await db
        .select({ minPrice: sql<string>`MIN(${variants.price})` })
        .from(variants)
        .where(eq(variants.productId, p.id));

      return {
        ...p,
        image: image?.imageUrl ?? '',
        minPrice: Number(priceRow?.minPrice ?? 0),
      };
    })
  );

  return enriched;
}