import { pgTable, serial, text, varchar, boolean, integer, timestamp, pgEnum, decimal } from 'drizzle-orm/pg-core';

// ---- Brands ----
export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  logoUrl: text('logo_url'),
  isFeatured: boolean('is_featured').notNull().default(false),
});

// ---- Seasons ----
export const seasons = pgTable('seasons', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
});

// ---- Olfactory Families ----
export const olfactoryFamilies = pgTable('olfactory_families', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
});

// ---- Olfactory Notes ----
export const olfactoryNotes = pgTable('olfactory_notes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
});

// ---- Enums ----
export const genderEnum = pgEnum('gender', ['masculino', 'femenino', 'unisex']);
export const concentrationEnum = pgEnum('concentration', ['EDT', 'EDP', 'Parfum', 'Extrait', 'Cologne']);
export const perfumeTypeEnum = pgEnum('perfume_type', ['arabe', 'diseñador', 'nicho']);

// ---- Products ----
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  slug: varchar('slug', { length: 150 }).notNull().unique(),
  brandId: integer('brand_id').notNull().references(() => brands.id),
  gender: genderEnum('gender').notNull(),
  concentration: concentrationEnum('concentration').notNull(),
  perfumeType: perfumeTypeEnum('perfume_type').notNull(),
  dupeOf: varchar('dupe_of', { length: 150 }),
  isFeatured: boolean('is_featured').notNull().default(false),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ---- Product Images ----
export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  imageUrl: text('image_url').notNull(),
  isMain: boolean('is_main').notNull().default(false),
  displayOrder: integer('display_order').notNull().default(0),
});

// ---- Product <-> Olfactory Families (many to many) ----
export const productOlfactoryFamilies = pgTable('product_olfactory_families', {
  productId: integer('product_id').notNull().references(() => products.id),
  olfactoryFamilyId: integer('olfactory_family_id').notNull().references(() => olfactoryFamilies.id),
});

// ---- Product <-> Olfactory Notes (many to many) ----
export const productOlfactoryNotes = pgTable('product_olfactory_notes', {
  productId: integer('product_id').notNull().references(() => products.id),
  olfactoryNoteId: integer('olfactory_note_id').notNull().references(() => olfactoryNotes.id),
});

// ---- Product <-> Seasons (many to many) ----
export const productSeasons = pgTable('product_seasons', {
  productId: integer('product_id').notNull().references(() => products.id),
  seasonId: integer('season_id').notNull().references(() => seasons.id),
});

// ---- Enums para variants ----
export const availabilityEnum = pgEnum('availability', ['disponible', 'agotado', 'por_encargo']);

// ---- Variants ----
export const variants = pgTable('variants', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  sizeMl: integer('size_ml').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  availability: availabilityEnum('availability').notNull().default('disponible'),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
});

// ---- Enums para promotions ----
export const discountTypeEnum = pgEnum('discount_type', ['porcentaje', 'monto_fijo']);
export const targetTypeEnum = pgEnum('target_type', ['product', 'brand', 'variant', 'all']);

// ---- Promotions ----
export const promotions = pgTable('promotions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  discountType: discountTypeEnum('discount_type').notNull(),
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  isActive: boolean('is_active').notNull().default(true),
});

// ---- Promotion Targets ----
export const promotionTargets = pgTable('promotion_targets', {
  id: serial('id').primaryKey(),
  promotionId: integer('promotion_id').notNull().references(() => promotions.id),
  targetType: targetTypeEnum('target_type').notNull(),
  targetId: integer('target_id'),
});

// ---- Enums para orders ----
export const orderStatusEnum = pgEnum('order_status', ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado']);

// ---- Addresses ----
export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  street: varchar('street', { length: 200 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  region: varchar('region', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }),
  phone: varchar('phone', { length: 20 }).notNull(),
});

// ---- Orders ----
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  addressId: integer('address_id').notNull().references(() => addresses.id),
  status: orderStatusEnum('status').notNull().default('pendiente'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  discountTotal: decimal('discount_total', { precision: 10, scale: 2 }).notNull().default('0'),
  shippingTotal: decimal('shipping_total', { precision: 10, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 200 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ---- Order Items ----
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id),
  variantId: integer('variant_id').notNull().references(() => variants.id),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(), // precio al momento de compra
});

// ---- Top Bar Messages ----
export const topBarMessages = pgTable('top_bar_messages', {
  id: serial('id').primaryKey(),
  message: varchar('message', { length: 200 }).notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});

// ---- Hero Slides ----
export const heroSlides = pgTable('hero_slides', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  title: varchar('title', { length: 150 }),
  subtitle: varchar('subtitle', { length: 200 }),
  linkUrl: text('link_url'),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});

// ---- Animated Banner Messages ----
export const animatedBannerMessages = pgTable('animated_banner_messages', {
  id: serial('id').primaryKey(),
  message: varchar('message', { length: 200 }).notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});


import type { AdapterAccountType } from 'next-auth/adapters';

// ---- Auth.js: Users ----
export const userRoleEnum = pgEnum('user_role', ['admin', 'customer']);

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 150 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  password: text('password'),
  role: userRoleEnum('role').notNull().default('customer'),
});

// ---- Auth.js: Accounts (vincula login con Google, etc.) ----
export const accounts = pgTable('accounts', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<AdapterAccountType>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

// ---- Auth.js: Sessions ----
export const sessionsTable = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

// ---- Auth.js: Verification Tokens (recuperar contraseña, verificar email) ----
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires').notNull(),
});

// ---- Carts ----
export const carts = pgTable('carts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ---- Cart Items ----
export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  cartId: text('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  variantId: integer('variant_id').notNull().references(() => variants.id),
  quantity: integer('quantity').notNull().default(1),
});

// ---- Shipping Config (tarifa fija configurable) ----
export const shippingConfig = pgTable('shipping_config', {
  id: serial('id').primaryKey(),
  flatRate: decimal('flat_rate', { precision: 10, scale: 2 }).notNull(),
  freeShippingThreshold: decimal('free_shipping_threshold', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').notNull().default(true),
});

// ---- Trust Badges ----
export const iconOptionEnum = pgEnum('icon_option', ['perfume', 'shipping', 'securePayment', 'heart', 'cart']);

export const trustBadges = pgTable('trust_badges', {
  id: serial('id').primaryKey(),
  icon: iconOptionEnum('icon').notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  subtitle: varchar('subtitle', { length: 150 }),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});

// ---- Perfume Requests ----
export const perfumeRequests = pgTable('perfume_requests', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  perfumeName: varchar('perfume_name', { length: 200 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ---- Reviews ----
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  userId: text('user_id').notNull().references(() => users.id),
  orderId: integer('order_id').notNull().references(() => orders.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ---- Wishlist ----
export const wishlistItems = pgTable('wishlist_items', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => products.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});