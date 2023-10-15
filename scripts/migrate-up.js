import { migrate } from 'drizzle-orm/mysql2/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.PRIVATE_DATABASE_URL);
const db = drizzle(client);

await migrate(db, { migrationsFolder: './drizzle' })
	.then(() => {
		console.log('Migrations completed.');
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
