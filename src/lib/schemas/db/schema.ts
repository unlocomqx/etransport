import { pgEnum, pgTable, real, timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export const modeEnum = pgEnum('mode', ['', 'bus', 'train']);

export const locations = pgTable('locations', {
	id: varchar('id').primaryKey().$defaultFn(nanoid),
	id_user: varchar('id_user').notNull(),
	latitude: real('latitude').notNull(),
	longitude: real('longitude').notNull(),
	timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
	mode: modeEnum('mode').notNull()
});
