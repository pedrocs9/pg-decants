CREATE TYPE "public"."availability" AS ENUM('disponible', 'agotado', 'por_encargo');--> statement-breakpoint
CREATE TYPE "public"."concentration" AS ENUM('EDT', 'EDP', 'Parfum', 'Extrait', 'Cologne');--> statement-breakpoint
CREATE TYPE "public"."discount_type" AS ENUM('porcentaje', 'monto_fijo');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('masculino', 'femenino', 'unisex');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."target_type" AS ENUM('product', 'brand', 'variant', 'all');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"full_name" varchar(150) NOT NULL,
	"street" varchar(200) NOT NULL,
	"city" varchar(100) NOT NULL,
	"region" varchar(100) NOT NULL,
	"postal_code" varchar(20),
	"phone" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"logo_url" text,
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "olfactory_families" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "olfactory_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"variant_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"address_id" integer NOT NULL,
	"status" "order_status" DEFAULT 'pendiente' NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"discount_total" numeric(10, 2) DEFAULT '0' NOT NULL,
	"shipping_total" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"stripe_payment_intent_id" varchar(200),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"image_url" text NOT NULL,
	"is_main" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_olfactory_families" (
	"product_id" integer NOT NULL,
	"olfactory_family_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_olfactory_notes" (
	"product_id" integer NOT NULL,
	"olfactory_note_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_seasons" (
	"product_id" integer NOT NULL,
	"season_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"brand_id" integer NOT NULL,
	"gender" "gender" NOT NULL,
	"concentration" "concentration" NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "promotion_targets" (
	"id" serial PRIMARY KEY NOT NULL,
	"promotion_id" integer NOT NULL,
	"target_type" "target_type" NOT NULL,
	"target_id" integer
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"discount_type" "discount_type" NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"size_ml" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"availability" "availability" DEFAULT 'disponible' NOT NULL,
	"sku" varchar(50) NOT NULL,
	CONSTRAINT "variants_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_olfactory_families" ADD CONSTRAINT "product_olfactory_families_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_olfactory_families" ADD CONSTRAINT "product_olfactory_families_olfactory_family_id_olfactory_families_id_fk" FOREIGN KEY ("olfactory_family_id") REFERENCES "public"."olfactory_families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_olfactory_notes" ADD CONSTRAINT "product_olfactory_notes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_olfactory_notes" ADD CONSTRAINT "product_olfactory_notes_olfactory_note_id_olfactory_notes_id_fk" FOREIGN KEY ("olfactory_note_id") REFERENCES "public"."olfactory_notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_seasons" ADD CONSTRAINT "product_seasons_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_seasons" ADD CONSTRAINT "product_seasons_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_targets" ADD CONSTRAINT "promotion_targets_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;