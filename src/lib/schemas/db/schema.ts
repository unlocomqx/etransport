import { pgTable, real, timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export const locations = pgTable('locations', {
	id: varchar('id').primaryKey().$defaultFn(nanoid),
	id_user: varchar('id_user').notNull(),
	latitude: real('latitude').notNull(),
	longitude: real('longitude').notNull(),
	timestamp: timestamp('timestamp', { withTimezone: true }).notNull()
});
