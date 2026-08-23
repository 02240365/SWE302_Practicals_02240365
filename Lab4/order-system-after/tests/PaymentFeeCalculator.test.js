const { calculatePaymentFee } = require("../src/PaymentFeeCalculator");

describe("calculatePaymentFee", () => {
  test("credit card fee scales down as subtotal grows", () => {
    expect(calculatePaymentFee(150, "card", "credit")).toBeCloseTo(150 * 0.029 + 0.3);
    expect(calculatePaymentFee(75, "card", "credit")).toBeCloseTo(75 * 0.035 + 0.3);
    expect(calculatePaymentFee(20, "card", "credit")).toBeCloseTo(20 * 0.04 + 0.3);
  });

  test("debit card has a flat rate + fee", () => {
    expect(calculatePaymentFee(100, "card", "debit")).toBeCloseTo(100 * 0.015 + 0.15);
  });

  test("wallet fee is 1%", () => {
    expect(calculatePaymentFee(100, "wallet")).toBeCloseTo(1);
  });

  test("cash has no fee", () => {
    expect(calculatePaymentFee(100, "cash")).toBe(0);
  });

  test("unknown payment method falls back to default rate", () => {
    expect(calculatePaymentFee(100, "crypto")).toBeCloseTo(2);
  });
});
