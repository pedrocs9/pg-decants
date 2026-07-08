ALTER TABLE "olfactory_families" ADD CONSTRAINT "olfactory_families_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "olfactory_notes" ADD CONSTRAINT "olfactory_notes_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_name_unique" UNIQUE("name");