const {
  DOMESTIC_COUNTRY_CODE,
  FREE_SHIPPING_THRESHOLD,
  MID_SHIPPING_THRESHOLD,
  SHIPPING_RATES,
} = require("./constants");

function calculateShipping(subtotal, country) {
  const isDomestic = country === DOMESTIC_COUNTRY_CODE;

  if (isDomestic) {
    if (subtotal > FREE_SHIPPING_THRESHOLD) return 0;
    return subtotal > MID_SHIPPING_THRESHOLD
      ? SHIPPING_RATES.domestic.mid
      : SHIPPING_RATES.domestic.low;
  }

  if (subtotal > FREE_SHIPPING_THRESHOLD) return SHIPPING_RATES.international.high;
  return subtotal > MID_SHIPPING_THRESHOLD
    ? SHIPPING_RATES.international.mid
    : SHIPPING_RATES.international.low;
}

module.exports = { calculateShipping };
