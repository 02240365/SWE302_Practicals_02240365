const { OrderNotFoundError } = require("./errors");

/**
 * In-memory repository. Each instance owns its own storage array instead
 * of relying on module-level (global) mutable state, so tests never leak
 * data between each other and multiple repositories can coexist.
 */
class OrderRepository {
  constructor() {
    this._orders = [];
  }

  save(order) {
    this._orders.push(order);
    return order;
  }

  findById(id) {
    const order = this._orders.find((o) => o.id === id);
    if (!order) {
      throw new OrderNotFoundError(id);
    }
    return order;
  }

  findAll() {
    return [...this._orders];
  }
}

module.exports = { OrderRepository };
