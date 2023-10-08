import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export const locations = pgTable('locations', {
	id: varchar('id').primaryKey().$defaultFn(nanoid),
	id_user: varchar('id_user').notNull(),
	latitude: varchar('latitude').notNull(),
	longitude: varchar('longitude').notNull(),
	timestamp: varchar('timestamp').notNull()
});
