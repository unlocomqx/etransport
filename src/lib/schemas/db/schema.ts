import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export const Users = pgTable('configs', {
	id: varchar('id').primaryKey().$defaultFn(nanoid),

	name: varchar('name').notNull(),

	background_image: varchar('background_image'),
	background_width: integer('background_width'),
	background_height: integer('background_height'),

	overlay_image: varchar('overlay_image'),
	overlay_width: integer('overlay_width'),
	overlay_height: integer('overlay_height'),

	createdAt: timestamp('date_created').notNull().defaultNow(),
	updatedAt: timestamp('date_updated').notNull().defaultNow()
});
