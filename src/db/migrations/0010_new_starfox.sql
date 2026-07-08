CREATE TYPE "public"."user_role" AS ENUM('admin', 'customer');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'customer' NOT NULL;