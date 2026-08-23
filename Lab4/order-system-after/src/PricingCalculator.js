/**
 * Sums (price * quantity) for every line item.
 * Pure function — no shared state, easy to test with plain arrays.
 */
function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

module.exports = { calculateSubtotal };
