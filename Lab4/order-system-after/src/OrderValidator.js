const { ValidationError } = require("./errors");

// Pure functions: given the same input, always produce the same
// output/throw, with no side effects (no console.log, no I/O). This is
// what makes them trivial to unit test in isolation.

function validateCustomerName(name) {
  if (!name || name.trim() === "") {
    throw new ValidationError("Customer name is required.");
  }
}

function validateItems(items) {
  if (!items || items.length === 0) {
    throw new ValidationError("Order must contain at least one item.");
  }
  items.forEach((item, index) => {
    if (item.price == null || item.price < 0) {
      throw new ValidationError(`Item ${index}: price must be a non-negative number.`);
    }
    if (item.qty == null || item.qty <= 0) {
      throw new ValidationError(`Item ${index}: quantity must be greater than zero.`);
    }
  });
}

function validateOrder(orderData) {
  validateCustomerName(orderData.customerName);
  validateItems(orderData.items);
}

module.exports = { validateOrder, validateCustomerName, validateItems };
