CREATE TYPE "public"."icon_option" AS ENUM('perfume', 'shipping', 'securePayment', 'heart', 'cart');--> statement-breakpoint
CREATE TABLE "trust_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"icon" "icon_option" NOT NULL,
	"title" varchar(100) NOT NULL,
	"subtitle" varchar(150),
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
