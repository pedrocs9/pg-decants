import { db } from '@/db';
import {
  products,
  productImages,
  variants,
  brands,
  productOlfactoryFamilies,
  olfactoryFamilies,
  productOlfactoryNotes,
  olfactoryNotes,
  productSeasons,
  seasons,
} from '@/db/schema';

import { eq, and, gte, lte, inArray, sql, SQL, desc, ilike } from 'drizzle-orm';

export type ProductFilters = {
  genero?: string;
  tipo?: string;
  marca?: string[];
  familia?: string[];
  temporada?: string[];
  precioMin?: number;
  precioMax?: number;
  buscar?: string;
  orden?: 'relevancia' | 'precio_asc' | 'precio_desc' | 'nombre';
};

export async function getFilteredProducts(filters: ProductFilters) {
  const conditions: SQL[] = [eq(products.isActive, true)];

  if (filters.genero) {
    conditions.push(eq(products.gender, filters.genero as 'masculino' | 'femenino' | 'unisex'));
  }

  if (filters.tipo) {
    conditions.push(eq(products.perfumeType, filters.tipo as 'arabe' | 'diseñador' | 'nicho'));
  }

  if (filters.marca && filters.marca.length > 0) {
    const brandRows = await db.select({ id: brands.id }).from(brands).where(inArray(brands.slug, filters.marca));
    const brandIds = brandRows.map((b) => b.id);
    if (brandIds.length > 0) {
      conditions.push(inArray(products.brandId, brandIds));
    }
  }

  let productIdsFromFamily: number[] | null = null;
  if (filters.familia && filters.familia.length > 0) {
    const rows = await db
      .select({ productId: productOlfactoryFamilies.productId })
      .from(productOlfactoryFamilies)
      .innerJoin(olfactoryFamilies, eq(productOlfactoryFamilies.olfactoryFamilyId, olfactoryFamilies.id))
      .where(inArray(olfactoryFamilies.name, filters.familia));
    productIdsFromFamily = rows.map((r) => r.productId);
  }

  let productIdsFromSeason: number[] | null = null;
  if (filters.temporada && filters.temporada.length > 0) {
    const rows = await db
      .select({ productId: productSeasons.productId })
      .from(productSeasons)
      .innerJoin(seasons, eq(productSeasons.seasonId, seasons.id))
      .where(inArray(seasons.name, filters.temporada));
    productIdsFromSeason = rows.map((r) => r.productId);
  }

  if (productIdsFromFamily) {
    conditions.push(
      productIdsFromFamily.length > 0
        ? inArray(products.id, productIdsFromFamily)
        : sql`false`
    );
  }
  if (productIdsFromSeason) {
    conditions.push(
      productIdsFromSeason.length > 0
        ? inArray(products.id, productIdsFromSeason)
        : sql`false`
    );
  }
    if (filters.buscar && filters.buscar.trim().length > 0) {
    conditions.push(ilike(products.name, `%${filters.buscar}%`));
  }
  const baseProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      gender: products.gender,
      perfumeType: products.perfumeType,
      dupeOf: products.dupeOf,
      brandName: brands.name,
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(and(...conditions));

  // Traer imagen principal + precio mínimo de cada producto
  const enriched = await Promise.all(
    baseProducts.map(async (p) => {
      const [mainImage] = await db
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
        image: mainImage?.imageUrl ?? '',
        minPrice: Number(priceRow?.minPrice ?? 0),
      };
    })
  );

  // Filtro de precio (post-consulta, ya que depende del MIN calculado)
  let result = enriched;
  if (filters.precioMin !== undefined) {
    result = result.filter((p) => p.minPrice >= filters.precioMin!);
  }
  if (filters.precioMax !== undefined) {
    result = result.filter((p) => p.minPrice <= filters.precioMax!);
  }

  // Orden
  switch (filters.orden) {
    case 'precio_asc':
      result.sort((a, b) => a.minPrice - b.minPrice);
      break;
    case 'precio_desc':
      result.sort((a, b) => b.minPrice - a.minPrice);
      break;
    case 'nombre':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return result;
}

export async function getFilterOptions() {
  const brandRows = await db.select({ id: brands.id, name: brands.name, slug: brands.slug }).from(brands);
  const familyRows = await db.select({ id: olfactoryFamilies.id, name: olfactoryFamilies.name }).from(olfactoryFamilies);
  const seasonRows = await db.select({ id: seasons.id, name: seasons.name }).from(seasons);

  return { brandOptions: brandRows, familyOptions: familyRows, seasonOptions: seasonRows };
}

export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      gender: products.gender,
      concentration: products.concentration,
      perfumeType: products.perfumeType,
      dupeOf: products.dupeOf,
      description: products.description,
      brandId: products.brandId,
      brandName: brands.name,
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.slug, slug));

  if (!product) return null;

  const images = await db
    .select({ id: productImages.id, imageUrl: productImages.imageUrl, isMain: productImages.isMain })
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(productImages.displayOrder);

  const productVariants = await db
    .select({
      id: variants.id,
      sizeMl: variants.sizeMl,
      price: variants.price,
      stock: variants.stock,
      availability: variants.availability,
    })
    .from(variants)
    .where(eq(variants.productId, product.id))
    .orderBy(variants.sizeMl);

  const familyRows = await db
    .select({ name: olfactoryFamilies.name })
    .from(productOlfactoryFamilies)
    .innerJoin(olfactoryFamilies, eq(productOlfactoryFamilies.olfactoryFamilyId, olfactoryFamilies.id))
    .where(eq(productOlfactoryFamilies.productId, product.id));

  const noteRows = await db
    .select({ name: olfactoryNotes.name })
    .from(productOlfactoryNotes)
    .innerJoin(olfactoryNotes, eq(productOlfactoryNotes.olfactoryNoteId, olfactoryNotes.id))
    .where(eq(productOlfactoryNotes.productId, product.id));

  const seasonRows = await db
    .select({ name: seasons.name })
    .from(productSeasons)
    .innerJoin(seasons, eq(productSeasons.seasonId, seasons.id))
    .where(eq(productSeasons.productId, product.id));

  return {
    ...product,
    images,
    variants: productVariants,
    families: familyRows.map((f) => f.name),
    notes: noteRows.map((n) => n.name),
    seasons: seasonRows.map((s) => s.name),
  };
}

export async function getRelatedProducts(brandId: number, excludeProductId: number) {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      brandName: brands.name,
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(and(eq(products.brandId, brandId), eq(products.isActive, true)))
    .limit(4);

  const filtered = rows.filter((r) => r.id !== excludeProductId);

  const enriched = await Promise.all(
    filtered.map(async (p) => {
      const [mainImage] = await db
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
        image: mainImage?.imageUrl ?? '',
        minPrice: Number(priceRow?.minPrice ?? 0),
      };
    })
  );

  return enriched;
}

export async function getNewArrivals(limit: number = 8) {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      brandName: brands.name,
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt))
    .limit(limit);

  const enriched = await Promise.all(
    rows.map(async (p) => {
      const [mainImage] = await db
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
        image: mainImage?.imageUrl ?? '',
        minPrice: Number(priceRow?.minPrice ?? 0),
      };
    })
  );

  return enriched;
}