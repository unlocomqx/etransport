CREATE TABLE IF NOT EXISTS "reactions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"id_location" varchar NOT NULL,
	"ip" varchar NOT NULL,
	"type" varchar NOT NULL
);
