import { faker } from "@faker-js/faker";

describe("Map", () => {
  beforeEach(() => {
    cy
      .viewport(786, 1024);
  });

  it("validate location", () => {
    cy
      .load("/map")
      .get("div").contains("Invalid location").should("be.visible");
  });

  it("display map", () => {
    cy
      .task("seedLocations", { count: 100 })
      .load("/", {
        onBeforeLoad({ navigator }) {
          const latitude = 35.765249;
          const longitude = 10.809677;
          cy.stub(navigator.geolocation, "getCurrentPosition")
            .callsArgWith(0, { coords: { latitude, longitude } });
        }
      })
      .get("button").contains("Find transport").click()
      .get(`[data-cy=center-marker]`).should("exist")
      .get(`[data-cy=transport-marker]`).should("exist")
      .wait(1000)
      .task("insertLocation", {
        id: "new-location",
        id_user: "new-user",
        latitude: 35.765249,
        longitude: 10.809677,
        timestamp: (new Date()).toISOString(),
        mode: "bus"
      })
      .get(`[data-cy-id=new-location]`)
      .should("have.attr", "data-cy-mode", "bus");
  });

  it.only("update position", () => {
    cy
      .task("seedLocations", { count: 100 })
      .load("/", {
        onBeforeLoad({ navigator }) {
          const origin = [ 35.765249, 10.809677 ] as [ number, number ];
          cy.stub(navigator.geolocation, "getCurrentPosition")
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
      .get("button").contains("Find transport").click()
      .wait(1000)
      .get(`[data-cy=update-position]`).click()
      .wait(1000)
      .get(`[data-cy=update-position]`).click();
  });
});
