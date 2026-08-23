const { calculateDiscount } = require("../src/DiscountCalculator");

describe("calculateDiscount", () => {
  test("SAVE10 gives 10% above the threshold", () => {
    expect(calculateDiscount(100, "SAVE10")).toBeCloseTo(10);
  });

  test("SAVE10 gives nothing at/below the threshold", () => {
    expect(calculateDiscount(50, "SAVE10")).toBe(0);
  });

  test("SAVE20 gives 20% above 100, else 5%", () => {
    expect(calculateDiscount(150, "SAVE20")).toBeCloseTo(30);
    expect(calculateDiscount(80, "SAVE20")).toBeCloseTo(4);
  });

  test("VIP gold scales with subtotal", () => {
    expect(calculateDiscount(250, "VIP", "gold")).toBeCloseTo(62.5);
    expect(calculateDiscount(150, "VIP", "gold")).toBeCloseTo(22.5);
    expect(calculateDiscount(50, "VIP", "gold")).toBeCloseTo(5);
  });

  test("VIP silver scales with subtotal", () => {
    expect(calculateDiscount(250, "VIP", "silver")).toBeCloseTo(37.5);
    expect(calculateDiscount(50, "VIP", "silver")).toBeCloseTo(2.5);
  });

  test("unknown code gives no discount", () => {
    expect(calculateDiscount(100, "NOT_REAL")).toBe(0);
  });
});
