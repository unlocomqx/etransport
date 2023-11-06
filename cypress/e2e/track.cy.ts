import { computeDestinationPoint } from 'geolib';

describe('Tracker', () => {
	beforeEach(() => {
		cy
			.viewport(786, 1024);
	});

	it('display heading', () => {
		cy
			.task('seedLocations', { count: 20, radius: 1 })
			.load('/track', {
				onBeforeLoad({ navigator }) {
					const latitude = 35.765249;
					const longitude = 10.809677;
					cy.stub(navigator.geolocation, 'getCurrentPosition')
						.callsArgWith(0, { coords: { latitude, longitude } });
					let distance = 0;
					cy.stub(navigator.geolocation, 'watchPosition')
						.callsFake((success) => {
							setInterval(() => {
								const pt = computeDestinationPoint(
									{ latitude, longitude },
									distance,
									90
								);
								distance += 50;
								success({ coords: pt, timestamp: Date.now() });
							}, 1000);
						});
				}
			})
			.get(`[data-cy=map]`)
			.get(`[data-cy=transport-marker][data-heading=90]`).should('have.length', 1);
	});
});
