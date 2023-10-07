describe("attributes", () => {
  it("add attribute", () => {
    cy
      .task("seed", { spec: "config" })
      .load("/configs/1/view")
  })
})
