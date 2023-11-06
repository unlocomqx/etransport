import { faker } from '@faker-js/faker';

describe('Map', () => {
	beforeEach(() => {
		cy
			.viewport(786, 1024);
	});

	it('display map', () => {
		cy
			.task('seedLocations', { count: 20, radius: 1 })
			.load('/map', {
				onBeforeLoad({ navigator }) {
					const latitude = 35.765249;
					const longitude = 10.809677;
					cy.stub(navigator.geolocation, 'getCurrentPosition')
						.callsArgWith(0, { coords: { latitude, longitude } });
				}
			})
			.get(`[data-cy=center-marker]`).should('exist')
			.get(`[data-cy=transport-marker]`).should('exist')
			.wait(1000)
			.task('insertLocation', {
				id: 'new-location',
				id_user: 'new-user',
				latitude: 35.765249,
				longitude: 10.809677,
				timestamp: (new Date()).toISOString(),
				mode: 'bus'
			})
			.get(`[data-cy-id=new-location]`)
			.should('have.attr', 'data-cy-mode', 'bus');
	});

	it('update position', () => {
		cy
			.task('seedLocations', { count: 40, radius: 2 })
			.load('/map', {
				onBeforeLoad({ navigator }) {
					const origin = [ 35.765249, 10.809677 ] as [ number, number ];
					cy.stub(navigator.geolocation, 'getCurrentPosition')
						.callsFake((success) => {
							const position = faker.location.nearbyGPSCoordinate({
								origin,
								radius: 1,
								isMetric: true
							});
							const [ latitude, longitude ] = position;
							success({ coords: { latitude, longitude } });
						});
				}
			})
			.wait(1000)
			.get(`[data-cy=update-position]`).click()
			.wait(1000)
			.get(`[data-cy=update-position]`).click();
	});

	it.only('display count', () => {
		cy
			.task('seed', { spec: 'locations' })
			.task('updateLocation', {
				id: '9',
				location: {
					timestamp: (new Date(Date.now() - 10000)).toISOString()
				}
			})
			.load('/map', {
				onBeforeLoad({ navigator }) {
					const latitude = 35.765249;
					const longitude = 10.809677;
					cy.stub(navigator.geolocation, 'getCurrentPosition')
						.callsArgWith(0, { coords: { latitude, longitude } });
				}
			})
			.get(`[data-cy=center-marker]`).should('exist')
			.get(`[data-cy=transport-marker]`).should('exist')
			.get(`[data-cy-id=9]`)
			.should('have.attr', 'data-cy-count', '1')
			.wait(1000)
			.task('insertLocation', {
				id: 'new-location',
				id_user: 'new-user',
				latitude: 35.765285,
				longitude: 10.8095,
				timestamp: (new Date(Date.now() - 10000)).toISOString(),
				mode: 'bus'
			})
			.get(`[data-cy=update-position]`).click()
			.get(`[data-cy-id=new-location]`)
			.should('have.attr', 'data-cy-count', '2');
	});

	it('display popover', () => {
		cy
			.task('seed', { spec: 'locations' })
			.task('updateLocation', {
				id: '8',
				location: {
					timestamp: (new Date(Date.now() - 10000)).toISOString()
				}
			})
			.task('updateLocation', {
				id: '9',
				location: {
					mode: 'bus',
					timestamp: (new Date(Date.now() - 10000)).toISOString()
				}
			})
			.task('insertLocation', {
				id: 'new-location',
				id_user: 'new-user',
				latitude: 35.765249,
				longitude: 10.809677,
				timestamp: (new Date(Date.now() - 10000)).toISOString(),
				mode: 'bus'
			})
			.load('/map', {
				onBeforeLoad({ navigator }) {
					const latitude = 35.765249;
					const longitude = 10.809677;
					cy.stub(navigator.geolocation, 'getCurrentPosition')
						.callsArgWith(0, { coords: { latitude, longitude } });
				}
			})
			.wait(1000)
			.get('.ol-layer').click()
			.wait(500)
			.get(`[data-cy=upvote-btn]:visible`).click();
	});

	it('display only last location from user', () => {
		cy
			.task('seed', { spec: 'user-locations' })
			.task('updateLocation', {
				id: '1',
				location: {
					timestamp: (new Date(Date.now() - 10000)).toISOString()
				}
			})
			.task('updateLocation', {
				id: '2',
				location: {
					mode: 'bus',
					timestamp: (new Date(Date.now() - 9000)).toISOString()
				}
			})
			.load('/map', {
				onBeforeLoad({ navigator }) {
					const latitude = 35.765249;
					const longitude = 10.809677;
					cy.stub(navigator.geolocation, 'getCurrentPosition')
						.callsArgWith(0, { coords: { latitude, longitude } });
				}
			})
			.get(`[data-cy-id=2]`).should('exist')
			.get(`[data-cy-id=1]`).should('not.exist')

			.task('insertLocation', {
				id: '3',
				id_user: 'my-user',
				latitude: 35.7746,
				longitude: 10.823,
				timestamp: (new Date(Date.now() - 3000)).toISOString(),
				mode: 'bus'
			})

			.wait(1000)
			.get(`[data-cy=update-position]`).click()

			.get(`[data-cy-id=2]`).should('not.exist')
			.get(`[data-cy-id=3]`).should('exist');
	});
});
