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

	it.only('stop tracking if idle', () => {
		cy
			.task('seedLocations', { count: 20, radius: 1 })
			.load('/track', {
				onBeforeLoad({ navigator }) {
					const latitude = 35.765249;
					const longitude = 10.809677;
					let distance = 0;
					let time = 60 * 4;
					cy.stub(navigator.geolocation, 'watchPosition')
						.callsFake((success) => {
							setInterval(() => {
								const pt = computeDestinationPoint(
									{ latitude, longitude },
									distance,
									90
								);
								distance += 1;
								time = Math.max(0, time - 30);
								console.log({ time });
								success({ coords: pt, timestamp: Date.now() - time * 1000 });
							}, 1000);
						});
				}
			})
			.get(`[data-cy-state=idle]`, {
				timeout: 20 * 1000
			});
	});
});
