import { db } from '$lib/db/client';
import { locations } from '$lib/schemas/db/schema';
import { eq } from 'drizzle-orm';

export function cleanUserLocations(id_user: string) {
	return db.delete(locations).where(eq(locations.id_user, id_user)).execute();
}