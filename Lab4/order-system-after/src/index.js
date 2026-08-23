const { OrderService } = require("./OrderService");
const { OrderRepository } = require("./OrderRepository");
const { NotificationService } = require("./NotificationService");
const { RandomIdGenerator, SystemClock } = require("./utils");

// Composition root: the only place real dependencies are constructed
// and wired together. Everything above this file is pure/injectable
// and has no idea it will eventually run against real time/randomness.
function createOrderService() {
  return new OrderService(
    new OrderRepository(),
    new NotificationService(),
    new RandomIdGenerator(),
    new SystemClock()
  );
}

module.exports = { createOrderService };
