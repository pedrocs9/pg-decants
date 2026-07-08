CREATE TABLE "shipping_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"flat_rate" numeric(10, 2) NOT NULL,
	"free_shipping_threshold" numeric(10, 2),
	"is_active" boolean DEFAULT true NOT NULL
);
