const { calculateShipping } = require("../src/ShippingCalculator");

describe("calculateShipping", () => {
  test("domestic orders over 100 ship free", () => {
    expect(calculateShipping(150, "BT")).toBe(0);
  });

  test("domestic orders between 50 and 100 pay the mid rate", () => {
    expect(calculateShipping(75, "BT")).toBeCloseTo(2.99);
  });

  test("domestic orders at/below 50 pay the low rate", () => {
    expect(calculateShipping(20, "BT")).toBeCloseTo(5.99);
  });

  test("international orders over 100 pay the high rate", () => {
    expect(calculateShipping(150, "US")).toBeCloseTo(4.99);
  });

  test("international orders at/below 50 pay the low rate", () => {
    expect(calculateShipping(20, "US")).toBeCloseTo(14.99);
  });
});
