import * as schema from '../schemas/db/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { PRIVATE_DATABASE_URL, PRIVATE_LOCAL_DATABASE_URL } from '$env/static/private';

const is_test = process.env.TEST === 'true';

const client = postgres(is_test ? PRIVATE_LOCAL_DATABASE_URL : PRIVATE_DATABASE_URL);
export const db = drizzle(client, { schema });
