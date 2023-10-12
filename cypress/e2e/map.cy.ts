describe("Map", () => {
  it("validate location", () => {
    cy
      .load("/map")
      .get("div").contains("Invalid location").should("be.visible");
  });

  it.only("display map", () => {
    cy
      .task("seedLocations")
      .load("/", {
        onBeforeLoad({ navigator }) {
          const latitude = 35.765249;
          const longitude = 10.809677;
          cy.stub(navigator.geolocation, "getCurrentPosition")
            .callsArgWith(0, { coords: { latitude, longitude } });
        }
      })
      .get("button").contains("Find transport").click();
  });
});
