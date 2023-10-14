import { pgEnum, pgTable, real, timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { sql } from 'drizzle-orm';

export const modeEnum = pgEnum('mode', ['', 'bus', 'train']);

export const locations = pgTable('locations', {
	id: varchar('id').primaryKey().$defaultFn(nanoid),
	id_user: varchar('id_user').notNull(),
	latitude: real('latitude').notNull(),
	longitude: real('longitude').notNull(),
	timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
	mode: modeEnum('mode').notNull()
});

export type LocationRow = typeof locations.$inferSelect;

export const users_reputation = pgTable('users_reputation', {
	id_user: varchar('id_user').primaryKey().notNull(),

	reputation: real('reputation').notNull().default(0),

	created_at: timestamp('create_date', { withTimezone: true })
		.notNull()
		.default(sql`now()`),
	updated_at: timestamp('update_date', { withTimezone: true })
		.notNull()
		.default(sql`now()`)
});

export const reactions = pgTable('reactions', {
	id: varchar('id').primaryKey().$defaultFn(nanoid),
	id_location: varchar('id_location').notNull(),
	ip: varchar('ip').notNull(),
	type: varchar('type').notNull()
});
