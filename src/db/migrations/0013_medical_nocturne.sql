CREATE TABLE "perfume_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL,
	"perfume_name" varchar(200) NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
