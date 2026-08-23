const { validateOrder } = require("../src/OrderValidator");
const { ValidationError } = require("../src/errors");

describe("validateOrder", () => {
  test("passes for a valid order", () => {
    expect(() =>
      validateOrder({
        customerName: "Sonam",
        items: [{ price: 10, qty: 2 }],
      })
    ).not.toThrow();
  });

  test("rejects a missing customer name", () => {
    expect(() => validateOrder({ customerName: "", items: [{ price: 10, qty: 1 }] })).toThrow(
      ValidationError
    );
  });

  test("rejects an order with no items", () => {
    expect(() => validateOrder({ customerName: "Sonam", items: [] })).toThrow(ValidationError);
  });

  test("rejects a negative item price", () => {
    expect(() =>
      validateOrder({ customerName: "Sonam", items: [{ price: -5, qty: 1 }] })
    ).toThrow(ValidationError);
  });

  test("rejects a zero item quantity", () => {
    expect(() =>
      validateOrder({ customerName: "Sonam", items: [{ price: 5, qty: 0 }] })
    ).toThrow(ValidationError);
  });
});
