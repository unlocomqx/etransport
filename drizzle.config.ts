import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
	schema: './src/lib/schemas/db/*',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.PRIVATE_LOCAL_DATABASE_URL
	}
} satisfies Config;
