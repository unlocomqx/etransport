import { migrate } from 'drizzle-orm/mysql2/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
	connectionString: process.env.PRIVATE_LOCAL_DATABASE_URL
});

const db = drizzle(pool);

try {
	await db.execute(sql`TRUNCATE TABLE drizzle.__drizzle_migrations;`);
} catch (e) {
	console.log('No migrations table found. Creating...');
}

// drop all tables
await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;`);

// eslint-disable-next-line
// @ts-ignore
await migrate(db, { migrationsFolder: './drizzle' })
	.then(() => {
		console.log('Migrations completed.');
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
