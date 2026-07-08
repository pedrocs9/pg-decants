CREATE TABLE "top_bar_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"message" varchar(200) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
