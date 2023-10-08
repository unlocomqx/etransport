CREATE TABLE IF NOT EXISTS "locations" (
	"id" varchar PRIMARY KEY NOT NULL,
	"id_user" varchar NOT NULL,
	"latitude" varchar NOT NULL,
	"longitude" varchar NOT NULL,
	"timestamp" varchar NOT NULL
);
