const {
  MIN_SUBTOTAL_FOR_SAVE10,
  SAVE10_RATE,
  SAVE20_HIGH_THRESHOLD,
  SAVE20_HIGH_RATE,
  SAVE20_LOW_RATE,
  VIP_GOLD_HIGH_THRESHOLD,
  VIP_GOLD_MID_THRESHOLD,
  VIP_GOLD_HIGH_RATE,
  VIP_GOLD_MID_RATE,
  VIP_GOLD_LOW_RATE,
  VIP_SILVER_THRESHOLD,
  VIP_SILVER_HIGH_RATE,
  VIP_SILVER_LOW_RATE,
} = require("./constants");

function save10Discount(subtotal) {
  return subtotal > MIN_SUBTOTAL_FOR_SAVE10 ? subtotal * SAVE10_RATE : 0;
}

function save20Discount(subtotal) {
  return subtotal > SAVE20_HIGH_THRESHOLD
    ? subtotal * SAVE20_HIGH_RATE
    : subtotal * SAVE20_LOW_RATE;
}

function vipGoldDiscount(subtotal) {
  if (subtotal > VIP_GOLD_HIGH_THRESHOLD) return subtotal * VIP_GOLD_HIGH_RATE;
  if (subtotal > VIP_GOLD_MID_THRESHOLD) return subtotal * VIP_GOLD_MID_RATE;
  return subtotal * VIP_GOLD_LOW_RATE;
}

function vipSilverDiscount(subtotal) {
  return subtotal > VIP_SILVER_THRESHOLD
    ? subtotal * VIP_SILVER_HIGH_RATE
    : subtotal * VIP_SILVER_LOW_RATE;
}

function vipDiscount(subtotal, customerType) {
  if (customerType === "gold") return vipGoldDiscount(subtotal);
  if (customerType === "silver") return vipSilverDiscount(subtotal);
  return 0;
}

// Strategy map keeps the "which code -> which rule" decision flat and
// data-driven, replacing the deeply nested if/else-if chain from the
// original implementation.
const DISCOUNT_STRATEGIES = {
  SAVE10: (subtotal) => save10Discount(subtotal),
  SAVE20: (subtotal) => save20Discount(subtotal),
  VIP: (subtotal, customerType) => vipDiscount(subtotal, customerType),
};

/**
 * @param {number} subtotal
 * @param {string|undefined} discountCode
 * @param {string|undefined} customerType
 * @returns {number} discount amount (never negative, never more than subtotal logic below implies)
 */
function calculateDiscount(subtotal, discountCode, customerType) {
  const strategy = DISCOUNT_STRATEGIES[discountCode];
  return strategy ? strategy(subtotal, customerType) : 0;
}

module.exports = { calculateDiscount };
