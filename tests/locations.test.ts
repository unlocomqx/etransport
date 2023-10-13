import { describe, it } from 'vitest';
import { faker } from '@faker-js/faker';
import { getGeoGroups } from '$lib/utils/geo';

describe('Locations', () => {
	it('groups locations', () => {
		const origin: [number, number] = [33.8869, 9.5375];
		const locations = [...Array(100)].map(
			(_) =>
				[
					faker.string.nanoid(),
					...faker.location.nearbyGPSCoordinate({
						origin,
						radius: 20,
						isMetric: true
					})
				] as [string, number, number]
		);

		const centers = getGeoGroups(locations);
		console.log(centers.filter(([, , count]) => count !== 1));
	});
});
