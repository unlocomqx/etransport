CREATE TABLE IF NOT EXISTS "users_reputation" (
	"id_user" varchar PRIMARY KEY NOT NULL,
	"reputation" real DEFAULT 0 NOT NULL,
	"create_date" timestamp with time zone DEFAULT now() NOT NULL,
	"update_date" timestamp with time zone DEFAULT now() NOT NULL
);
