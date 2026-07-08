import { db } from './index';
import {
  brands,
  seasons,
  olfactoryFamilies,
  olfactoryNotes,
  products,
  productImages,
  productOlfactoryFamilies,
  productOlfactoryNotes,
  productSeasons,
  variants,
  topBarMessages,
  heroSlides,
  animatedBannerMessages,
  shippingConfig,
  trustBadges,
} from './schema';
import { eq } from 'drizzle-orm';

/* eslint-disable @typescript-eslint/no-explicit-any */
async function getOrCreate<T extends { id: number }>(
  table: any,
  where: any,
  values: any
): Promise<T> {
  await db.insert(table).values(values).onConflictDoNothing();
  const [row] = await db.select().from(table).where(where);
  return row as T;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function seed() {
  console.log('Insertando datos de prueba...');

  // ---- Brands ----
  const chanel = await getOrCreate(brands, eq(brands.slug, 'chanel'), { name: 'Chanel', slug: 'chanel' });
  const dior = await getOrCreate(brands, eq(brands.slug, 'dior'), { name: 'Dior', slug: 'dior' });
  const lattafa = await getOrCreate(brands, eq(brands.slug, 'lattafa'), { name: 'Lattafa', slug: 'lattafa' });
  const creed = await getOrCreate(brands, eq(brands.slug, 'creed'), { name: 'Creed', slug: 'creed' });

  // ---- Seasons ----
  const verano = await getOrCreate(seasons, eq(seasons.name, 'Verano'), { name: 'Verano' });
  const invierno = await getOrCreate(seasons, eq(seasons.name, 'Invierno'), { name: 'Invierno' });
  const otonio = await getOrCreate(seasons, eq(seasons.name, 'Otoño'), { name: 'Otoño' });

  // ---- Olfactory Families ----
  const amaderado = await getOrCreate(olfactoryFamilies, eq(olfactoryFamilies.name, 'Amaderado'), { name: 'Amaderado' });
  const citrico = await getOrCreate(olfactoryFamilies, eq(olfactoryFamilies.name, 'Cítrico'), { name: 'Cítrico' });
  const oriental = await getOrCreate(olfactoryFamilies, eq(olfactoryFamilies.name, 'Oriental'), { name: 'Oriental' });
  const floral = await getOrCreate(olfactoryFamilies, eq(olfactoryFamilies.name, 'Floral'), { name: 'Floral' });

  // ---- Olfactory Notes ----
  const bergamota = await getOrCreate(olfactoryNotes, eq(olfactoryNotes.name, 'Bergamota'), { name: 'Bergamota' });
  const vainilla = await getOrCreate(olfactoryNotes, eq(olfactoryNotes.name, 'Vainilla'), { name: 'Vainilla' });
  const oud = await getOrCreate(olfactoryNotes, eq(olfactoryNotes.name, 'Oud'), { name: 'Oud' });
  const ambar = await getOrCreate(olfactoryNotes, eq(olfactoryNotes.name, 'Ámbar'), { name: 'Ámbar' });

  // ---- Producto 1: Bleu de Chanel (Diseñador) ----
  await db.insert(products).values({
    name: 'Bleu de Chanel',
    slug: 'bleu-de-chanel',
    brandId: chanel.id,
    gender: 'masculino',
    concentration: 'EDP',
    perfumeType: 'diseñador',
    isFeatured: true,
    description: 'Un aroma amaderado y fresco, ideal para uso diario.',
    isActive: true,
  }).onConflictDoNothing();
  const [bleuDeChanel] = await db.select().from(products).where(eq(products.slug, 'bleu-de-chanel'));

  await db.insert(productImages).values([
    { productId: bleuDeChanel.id, imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80', isMain: true, displayOrder: 0 },
    { productId: bleuDeChanel.id, imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80', isMain: false, displayOrder: 1 },
  ]).onConflictDoNothing();
  await db.insert(productOlfactoryFamilies).values({ productId: bleuDeChanel.id, olfactoryFamilyId: amaderado.id }).onConflictDoNothing();
  await db.insert(productOlfactoryNotes).values({ productId: bleuDeChanel.id, olfactoryNoteId: bergamota.id }).onConflictDoNothing();
  await db.insert(productSeasons).values({ productId: bleuDeChanel.id, seasonId: invierno.id }).onConflictDoNothing();
  await db.insert(variants).values([
    { productId: bleuDeChanel.id, sizeMl: 5, price: '5990', stock: 20, sku: 'BDC-5ML' },
    { productId: bleuDeChanel.id, sizeMl: 10, price: '9990', stock: 15, sku: 'BDC-10ML' },
  ]).onConflictDoNothing();

  // ---- Producto 2: Sauvage (Diseñador) ----
  await db.insert(products).values({
    name: 'Sauvage',
    slug: 'sauvage-dior',
    brandId: dior.id,
    gender: 'masculino',
    concentration: 'EDT',
    perfumeType: 'diseñador',
    isFeatured: true,
    description: 'Fresco y potente, con notas cítricas y amaderadas.',
    isActive: true,
  }).onConflictDoNothing();
  const [sauvage] = await db.select().from(products).where(eq(products.slug, 'sauvage-dior'));

  await db.insert(productImages).values([
    { productId: sauvage.id, imageUrl: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80', isMain: true, displayOrder: 0 },
    { productId: sauvage.id, imageUrl: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80', isMain: false, displayOrder: 1 },
  ]).onConflictDoNothing();
  await db.insert(productOlfactoryFamilies).values({ productId: sauvage.id, olfactoryFamilyId: citrico.id }).onConflictDoNothing();
  await db.insert(productOlfactoryNotes).values({ productId: sauvage.id, olfactoryNoteId: bergamota.id }).onConflictDoNothing();
  await db.insert(productSeasons).values({ productId: sauvage.id, seasonId: verano.id }).onConflictDoNothing();
  await db.insert(variants).values([
    { productId: sauvage.id, sizeMl: 5, price: '4990', stock: 25, sku: 'SAU-5ML' },
    { productId: sauvage.id, sizeMl: 10, price: '8990', stock: 18, sku: 'SAU-10ML' },
  ]).onConflictDoNothing();

  // ---- Producto 3: Khamrah (Árabe) ----
  await db.insert(products).values({
    name: 'Khamrah',
    slug: 'khamrah-lattafa',
    brandId: lattafa.id,
    gender: 'unisex',
    concentration: 'EDP',
    perfumeType: 'arabe',
    dupeOf: 'Inspirado en aromas orientales especiados',
    isFeatured: true,
    description: 'Intenso y especiado, con notas de ámbar y vainilla.',
    isActive: true,
  }).onConflictDoNothing();
  const [khamrah] = await db.select().from(products).where(eq(products.slug, 'khamrah-lattafa'));

  await db.insert(productImages).values([
    { productId: khamrah.id, imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80', isMain: true, displayOrder: 0 },
    { productId: khamrah.id, imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80', isMain: false, displayOrder: 1 },
  ]).onConflictDoNothing();
  await db.insert(productOlfactoryFamilies).values({ productId: khamrah.id, olfactoryFamilyId: oriental.id }).onConflictDoNothing();
  await db.insert(productOlfactoryNotes).values([
    { productId: khamrah.id, olfactoryNoteId: ambar.id },
    { productId: khamrah.id, olfactoryNoteId: vainilla.id },
  ]).onConflictDoNothing();
  await db.insert(productSeasons).values({ productId: khamrah.id, seasonId: otonio.id }).onConflictDoNothing();
  await db.insert(variants).values([
    { productId: khamrah.id, sizeMl: 5, price: '3990', stock: 30, sku: 'KHA-5ML' },
    { productId: khamrah.id, sizeMl: 10, price: '6990', stock: 20, sku: 'KHA-10ML' },
  ]).onConflictDoNothing();

  // ---- Producto 4: Aventus (Nicho) ----
  await db.insert(products).values({
    name: 'Aventus',
    slug: 'aventus-creed',
    brandId: creed.id,
    gender: 'masculino',
    concentration: 'EDP',
    perfumeType: 'nicho',
    isFeatured: false,
    description: 'Elegante y afrutado, un ícono de la perfumería de nicho.',
    isActive: true,
  }).onConflictDoNothing();
  const [aventus] = await db.select().from(products).where(eq(products.slug, 'aventus-creed'));

  await db.insert(productImages).values([
    { productId: aventus.id, imageUrl: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&q=80', isMain: true, displayOrder: 0 },
  ]).onConflictDoNothing();
  await db.insert(productOlfactoryFamilies).values({ productId: aventus.id, olfactoryFamilyId: floral.id }).onConflictDoNothing();
  await db.insert(productOlfactoryNotes).values({ productId: aventus.id, olfactoryNoteId: oud.id }).onConflictDoNothing();
  await db.insert(productSeasons).values({ productId: aventus.id, seasonId: verano.id }).onConflictDoNothing();
  await db.insert(variants).values([
    { productId: aventus.id, sizeMl: 5, price: '7990', stock: 10, sku: 'AVE-5ML' },
    { productId: aventus.id, sizeMl: 10, price: '13990', stock: 8, sku: 'AVE-10ML' },
  ]).onConflictDoNothing();

  // ---- Top Bar Messages ----
  await db.insert(topBarMessages).values([
    { message: 'Envío a todo Chile 🇨🇱', displayOrder: 0, isActive: true },
    { message: 'Compra sobre $20.000 y obtén un regalo sorpresa', displayOrder: 1, isActive: true },
    { message: 'Nuevos ingresos cada semana', displayOrder: 2, isActive: true },
  ]).onConflictDoNothing();

  // ---- Hero Slides ----
  await db.insert(heroSlides).values([
    { imageUrl: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1600&q=80', title: 'Decants 100% Originales', subtitle: 'En frascos premium, directo a tu puerta', linkUrl: '/decants', displayOrder: 0, isActive: true },
    { imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&q=80', title: 'Colección Árabe', subtitle: 'Intensidad y elegancia en cada gota', linkUrl: '/decants?tipo=arabe', displayOrder: 1, isActive: true },
    { imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1600&q=80', title: 'Colección Diseñador', subtitle: 'Grandes marcas, en el formato perfecto', linkUrl: '/decants?tipo=diseñador', displayOrder: 2, isActive: true },
    { imageUrl: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1600&q=80', title: 'Envío a Todo Chile', subtitle: 'Recibe tu decant favorito en 24-48 horas', linkUrl: '/decants', displayOrder: 3, isActive: true },
    { imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600&q=80', title: 'Elige tu Fragancia Ideal', subtitle: 'Sin comprar a ciegas, sin arrepentimientos', linkUrl: '/decants', displayOrder: 4, isActive: true },
  ]).onConflictDoNothing();

  // ---- Animated Banner Messages ----
  await db.insert(animatedBannerMessages).values([
    { message: 'Despachamos a todo Chile', displayOrder: 0, isActive: true },
    { message: 'Stock limitado en algunos aromas', displayOrder: 1, isActive: true },
    { message: 'Tiempos de preparación 24-48h', displayOrder: 2, isActive: true },
    { message: '100% Originales, sin alteraciones', displayOrder: 3, isActive: true },
  ]).onConflictDoNothing();

  // ---- Shipping Config ----
  await db.insert(shippingConfig).values({
    flatRate: '3000',
    freeShippingThreshold: '20000',
    isActive: true,
  }).onConflictDoNothing();

  // ---- Trust Badges ----
  await db.insert(trustBadges).values([
    { icon: 'perfume', title: '100% Originales', subtitle: 'Decants extraídos de perfumes auténticos', displayOrder: 0, isActive: true },
    { icon: 'shipping', title: 'Envío a Todo Chile', subtitle: 'Recibe en 24-48 horas', displayOrder: 1, isActive: true },
    { icon: 'securePayment', title: 'Pago Seguro', subtitle: 'Mercado Pago y tarjetas', displayOrder: 2, isActive: true },
    { icon: 'heart', title: 'Hecho con Dedicación', subtitle: 'Cada envase preparado con cuidado', displayOrder: 3, isActive: true },
  ]).onConflictDoNothing();

  console.log('¡Listo! Datos de prueba insertados.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error en el seed:', err);
  process.exit(1);
});