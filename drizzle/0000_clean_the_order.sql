CREATE TABLE IF NOT EXISTS "locations" (
	"id" varchar PRIMARY KEY NOT NULL,
	"id_user" varchar NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"timestamp" timestamp with time zone NOT NULL
);
