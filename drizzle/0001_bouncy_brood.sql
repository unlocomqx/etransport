DO $$ BEGIN
 CREATE TYPE "mode" AS ENUM('', 'bus', 'train');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "mode" "mode" NOT NULL;