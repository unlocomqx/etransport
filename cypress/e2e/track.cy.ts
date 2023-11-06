describe('Tracker', () => {
	beforeEach(() => {
		cy
			.viewport(786, 1024);
	});

	it('display map', () => {
		cy
			.task('seedLocations', { count: 20, radius: 1 })
			.load('/track', {
				onBeforeLoad({ navigator }) {
					const latitude = 35.765249;
					const longitude = 10.809677;
					cy.stub(navigator.geolocation, 'getCurrentPosition')
						.callsArgWith(0, { coords: { latitude, longitude } });
				}
			});
	});
});
