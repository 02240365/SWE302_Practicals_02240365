const { OrderService } = require("../src/OrderService");
const { OrderRepository } = require("../src/OrderRepository");
const { ValidationError, OrderNotFoundError } = require("../src/errors");

// Fakes replace the real notifier / id generator / clock, so tests are
// deterministic and produce no console output or real side effects.
// This is only possible because OrderService takes its dependencies
// through the constructor instead of reaching for globals.
class FakeNotificationService {
  constructor() {
    this.sentTo = [];
  }
  sendOrderConfirmation(order) {
    this.sentTo.push(order.customerName);
  }
}

class FakeIdGenerator {
  constructor(fixedId = 1) {
    this._fixedId = fixedId;
  }
  nextId() {
    return this._fixedId;
  }
}

class FakeClock {
  constructor(fixedDate = new Date("2026-01-01T00:00:00Z")) {
    this._fixedDate = fixedDate;
  }
  now() {
    return this._fixedDate;
  }
}

function buildService() {
  const repository = new OrderRepository();
  const notifier = new FakeNotificationService();
  const service = new OrderService(repository, notifier, new FakeIdGenerator(42), new FakeClock());
  return { service, repository, notifier };
}

describe("OrderService.placeOrder", () => {
  test("computes totals and persists the order deterministically", () => {
    const { service, repository } = buildService();

    const order = service.placeOrder({
      customerName: "Sonam",
      items: [{ price: 30, qty: 2 }], // subtotal = 60
      discountCode: "SAVE10",
      country: "BT",
      paymentMethod: "cash",
    });

    expect(order.id).toBe(42);
    expect(order.subtotal).toBe(60);
    expect(order.discount).toBeCloseTo(6); // 10% of 60
    expect(order.shipping).toBeCloseTo(2.99); // domestic, 50 < 60 <= 100
    expect(order.fee).toBe(0); // cash
    expect(order.total).toBeCloseTo(60 - 6 + 2.99 + 0);
    expect(repository.findAll()).toHaveLength(1);
  });

  test("notifies the customer after a successful order", () => {
    const { service, notifier } = buildService();

    service.placeOrder({
      customerName: "Pema",
      items: [{ price: 10, qty: 1 }],
      country: "BT",
      paymentMethod: "cash",
    });

    expect(notifier.sentTo).toEqual(["Pema"]);
  });

  test("rejects an invalid order before touching the repository", () => {
    const { service, repository } = buildService();

    expect(() =>
      service.placeOrder({ customerName: "", items: [{ price: 10, qty: 1 }] })
    ).toThrow(ValidationError);
    expect(repository.findAll()).toHaveLength(0);
  });
});

describe("OrderService.getOrderById", () => {
  test("throws OrderNotFoundError for an unknown id", () => {
    const { service } = buildService();
    expect(() => service.getOrderById(999)).toThrow(OrderNotFoundError);
  });
});
