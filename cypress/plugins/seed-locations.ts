import { seed } from './seed';
import type { LocationRow } from '../../src/lib/schemas/db/schema';
import { faker } from '@faker-js/faker';
import { exec } from 'child-process-promise';

export async function seedLocations(
	settings: {
		count?: number;
		radius?: number;
	} = {}
) {
	const location_settings = {
		count: 100,
		radius: 20,
		...settings
	};
	await seed('reset');
	const origin: [number, number] = [35.765249, 10.809677];
	const rows: LocationRow[] = [...Array(location_settings.count)].map((_, index) => {
		const location = faker.location.nearbyGPSCoordinate({
			origin,
			radius: location_settings.radius,
			isMetric: true
		});
		return {
			id: index.toString(),
			id_user: faker.string.nanoid(),
			latitude: location[0],
			longitude: location[1],
			timestamp: faker.date.between({
				from: new Date(Date.now() - 2 * 3600 * 1000),
				to: new Date()
			}),
			mode: faker.number.int({ min: 1, max: 2 }) === 1 ? 'bus' : 'train'
		};
	});

	const queries = rows.map((row) => {
		return `INSERT INTO locations (id, id_user, latitude, longitude, timestamp, mode) 
						VALUES (
							'${row.id}', 
							'${row.id_user}', 
							${row.latitude}, 
							${row.longitude}, 
							'${row.timestamp.toISOString()}', 
							'${row.mode}'
						);`;
	});

	// insert into public schema of etransport_test database
	const command = `psql -U postgres -c "${queries.join('\n')}" -d etransport_test`;

	return exec(command);
}

export async function insertLocation(location: LocationRow) {
	const query = `INSERT INTO locations (id, id_user, latitude, longitude, timestamp, mode)
									VALUES (	
										'${location.id}',
										'${location.id_user}',
										${location.latitude},
										${location.longitude},
										'${location.timestamp}',
										'${location.mode}'
									);`;
	const command = `psql -U postgres -c "${query}" -d etransport_test`;
	return exec(command);
}

export function updateLocation({ id, location }: { id: string; location: LocationRow }) {
	const query = `UPDATE locations SET 
									id_user = ${location.id_user ? `'${location.id_user}'` : 'id_user'},
									latitude = ${location.latitude ? location.latitude : 'latitude'},
									longitude = ${location.longitude ? location.longitude : 'longitude'},
									timestamp = ${location.timestamp ? `'${location.timestamp}'` : 'timestamp'},
									mode = ${location.mode ? `'${location.mode}'` : 'mode'}
								WHERE id = '${id}';`;
	const command = `psql -U postgres -c "${query}" -d etransport_test`;
	return exec(command);
}
