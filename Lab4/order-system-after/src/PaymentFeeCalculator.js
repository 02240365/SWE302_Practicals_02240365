const {
  CARD_FEE_RATES,
  WALLET_FEE_RATE,
  DEFAULT_FEE_RATE,
  CARD_FEE_HIGH_THRESHOLD,
  CARD_FEE_MID_THRESHOLD,
} = require("./constants");

function creditCardFee(subtotal) {
  if (subtotal > CARD_FEE_HIGH_THRESHOLD) {
    return subtotal * CARD_FEE_RATES.creditHigh + CARD_FEE_RATES.creditFlat;
  }
  if (subtotal > CARD_FEE_MID_THRESHOLD) {
    return subtotal * CARD_FEE_RATES.creditMid + CARD_FEE_RATES.creditFlat;
  }
  return subtotal * CARD_FEE_RATES.creditLow + CARD_FEE_RATES.creditFlat;
}

function cardFee(subtotal, cardType) {
  if (cardType === "credit") return creditCardFee(subtotal);
  if (cardType === "debit") return subtotal * CARD_FEE_RATES.debitRate + CARD_FEE_RATES.debitFlat;
  return subtotal * CARD_FEE_RATES.unknownCardRate;
}

// Data-driven map instead of an if/else-if/else chain.
const FEE_STRATEGIES = {
  card: (subtotal, cardType) => cardFee(subtotal, cardType),
  wallet: (subtotal) => subtotal * WALLET_FEE_RATE,
  cash: () => 0,
};

function calculatePaymentFee(subtotal, paymentMethod, cardType) {
  const strategy = FEE_STRATEGIES[paymentMethod];
  return strategy ? strategy(subtotal, cardType) : subtotal * DEFAULT_FEE_RATE;
}

module.exports = { calculatePaymentFee };
