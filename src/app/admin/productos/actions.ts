'use server';

import { db } from '@/db';
import {
  products,
  productImages,
  variants,
  productOlfactoryFamilies,
  productOlfactoryNotes,
  productSeasons,
  brands,
  olfactoryFamilies,
  olfactoryNotes,
  seasons,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getProductsList() {
  const list = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      brandName: brands.name,
      perfumeType: products.perfumeType,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .orderBy(products.name);

  const withImages = await Promise.all(
    list.map(async (product) => {
      const [image] = await db
        .select({ imageUrl: productImages.imageUrl })
        .from(productImages)
        .where(and(eq(productImages.productId, product.id), eq(productImages.isMain, true)))
        .limit(1);
      return { ...product, image: image?.imageUrl ?? null };
    })
  );

  return withImages;
}

export async function getFormOptions() {
  const brandOptions = await db.select().from(brands).orderBy(brands.name);
  const familyOptions = await db.select().from(olfactoryFamilies).orderBy(olfactoryFamilies.name);
  const noteOptions = await db.select().from(olfactoryNotes).orderBy(olfactoryNotes.name);
  const seasonOptions = await db.select().from(seasons).orderBy(seasons.name);
  return { brandOptions, familyOptions, noteOptions, seasonOptions };
}

export async function getProductForEdit(id: number) {
  const [product] = await db.select().from(products).where(eq(products.id, id));
  if (!product) return null;

  const images = await db.select().from(productImages).where(eq(productImages.productId, id)).orderBy(productImages.displayOrder);
  const productVariants = await db.select().from(variants).where(eq(variants.productId, id)).orderBy(variants.sizeMl);
  const familyIds = (await db.select({ id: productOlfactoryFamilies.olfactoryFamilyId }).from(productOlfactoryFamilies).where(eq(productOlfactoryFamilies.productId, id))).map((f) => f.id);
  const noteIds = (await db.select({ id: productOlfactoryNotes.olfactoryNoteId }).from(productOlfactoryNotes).where(eq(productOlfactoryNotes.productId, id))).map((n) => n.id);
  const seasonIds = (await db.select({ id: productSeasons.seasonId }).from(productSeasons).where(eq(productSeasons.productId, id))).map((s) => s.id);

  return { ...product, images, variants: productVariants, familyIds, noteIds, seasonIds };
}

type ProductInput = {
  name: string;
  slug: string;
  brandId: number;
  gender: 'masculino' | 'femenino' | 'unisex';
  concentration: 'EDT' | 'EDP' | 'Parfum' | 'Extrait' | 'Cologne';
  perfumeType: 'arabe' | 'diseñador' | 'nicho';
  dupeOf?: string;
  description?: string;
  isFeatured: boolean;
  isActive: boolean;
  images: { imageUrl: string; isMain: boolean }[];
variants: { id?: number; sizeMl: number; price: string; stock: number; availability: 'disponible' | 'agotado' | 'por_encargo'; sku: string }[];  familyIds: number[];
  noteIds: number[];
  seasonIds: number[];
};

export async function saveProduct(id: number | null, data: ProductInput) {
  let productId = id;

  if (productId) {
    await db
      .update(products)
      .set({
        name: data.name,
        slug: data.slug,
        brandId: data.brandId,
        gender: data.gender,
        concentration: data.concentration,
        perfumeType: data.perfumeType,
        dupeOf: data.dupeOf || null,
        description: data.description || null,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
      })
      .where(eq(products.id, productId));

    // Imágenes: sí se pueden borrar y recrear sin problema (no las referencia ningún pedido)
    await db.delete(productImages).where(eq(productImages.productId, productId));

    // Relaciones olfativas: también seguras de borrar y recrear
    await db.delete(productOlfactoryFamilies).where(eq(productOlfactoryFamilies.productId, productId));
    await db.delete(productOlfactoryNotes).where(eq(productOlfactoryNotes.productId, productId));
    await db.delete(productSeasons).where(eq(productSeasons.productId, productId));

    const existingVariants = await db.select().from(variants).where(eq(variants.productId, productId));
    const existingIds = existingVariants.map((v) => v.id);

    // IDs que vienen del form (variantes que ya existían)
    const incomingIds = data.variants.filter((v) => v.id).map((v) => v.id as number);

    // Eliminar variantes que ya no están en el form
    for (const existing of existingVariants) {
      if (!incomingIds.includes(existing.id)) {
        try {
          await db.delete(variants).where(eq(variants.id, existing.id));
        } catch {
          await db.update(variants).set({ availability: 'agotado', stock: 0 }).where(eq(variants.id, existing.id));
        }
      }
    }

    for (const v of data.variants) {
      if (v.id && existingIds.includes(v.id)) {
        // Actualizar variante existente
        await db
          .update(variants)
          .set({ sizeMl: v.sizeMl, price: v.price, stock: v.stock, availability: v.availability })
          .where(eq(variants.id, v.id));
      } else {
        // Insertar variante nueva — generar SKU si viene vacío
        const sku = v.sku?.trim()
          ? v.sku.trim()
          : `${data.slug}-${v.sizeMl}ml-${Date.now()}`;
        await db.insert(variants).values({ productId, sizeMl: v.sizeMl, price: v.price, stock: v.stock, availability: v.availability, sku });
      }
    }
  } else {
    const [newProduct] = await db
      .insert(products)
      .values({
        name: data.name,
        slug: data.slug,
        brandId: data.brandId,
        gender: data.gender,
        concentration: data.concentration,
        perfumeType: data.perfumeType,
        dupeOf: data.dupeOf || null,
        description: data.description || null,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
      })
      .returning();
    productId = newProduct.id;

    if (data.variants.length > 0) {
      await db.insert(variants).values(
        data.variants.map((v) => ({
          productId: productId!,
          sizeMl: v.sizeMl,
          price: v.price,
          stock: v.stock,
          availability: v.availability,
          sku: v.sku,
        }))
      );
    }
  }

  if (data.images.length > 0) {
    await db.insert(productImages).values(
      data.images.map((img, i) => ({
        productId: productId!,
        imageUrl: img.imageUrl,
        isMain: img.isMain,
        displayOrder: i,
      }))
    );
  }

  if (data.familyIds.length > 0) {
    await db.insert(productOlfactoryFamilies).values(data.familyIds.map((fid) => ({ productId: productId!, olfactoryFamilyId: fid })));
  }
  if (data.noteIds.length > 0) {
    await db.insert(productOlfactoryNotes).values(data.noteIds.map((nid) => ({ productId: productId!, olfactoryNoteId: nid })));
  }
  if (data.seasonIds.length > 0) {
    await db.insert(productSeasons).values(data.seasonIds.map((sid) => ({ productId: productId!, seasonId: sid })));
  }

  revalidatePath('/admin/productos');
  revalidatePath('/decants');
  redirect('/admin/productos');
}

export async function deleteProduct(id: number) {
  await db.delete(productImages).where(eq(productImages.productId, id));
  await db.delete(variants).where(eq(variants.productId, id));
  await db.delete(productOlfactoryFamilies).where(eq(productOlfactoryFamilies.productId, id));
  await db.delete(productOlfactoryNotes).where(eq(productOlfactoryNotes.productId, id));
  await db.delete(productSeasons).where(eq(productSeasons.productId, id));
  await db.delete(products).where(eq(products.id, id));
  revalidatePath('/admin/productos');
}