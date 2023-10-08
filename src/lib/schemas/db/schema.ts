import { boolean, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import type { InferSelectModel } from 'drizzle-orm';

export const users = pgTable('users', {
	id: varchar('id').primaryKey().$defaultFn(nanoid),
	email: text('email').notNull(),
	active: boolean('active').notNull().default(true),
	role: text('role').notNull().default('admin')
});

export type User = InferSelectModel<typeof users>;
