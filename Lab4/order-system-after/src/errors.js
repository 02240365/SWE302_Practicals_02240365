// Explicit, named error types instead of returning plain strings like
// "ERROR: missing customer name". Callers can now use instanceof /
// error.name to branch, and nothing fails silently.

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class OrderNotFoundError extends Error {
  constructor(orderId) {
    super(`Order not found: ${orderId}`);
    this.name = "OrderNotFoundError";
  }
}

module.exports = { ValidationError, OrderNotFoundError };
