CREATE TYPE "public"."perfume_type" AS ENUM('arabe', 'diseñador');--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "perfume_type" "perfume_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;