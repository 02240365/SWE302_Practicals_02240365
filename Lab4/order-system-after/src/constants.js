// Central place for all "magic numbers" used across the order system.
// Having them named and in one place removes duplication and makes
// business-rule changes a one-line edit instead of a search-and-replace.

const MIN_SUBTOTAL_FOR_SAVE10 = 50;

const SAVE20_HIGH_THRESHOLD = 100;
const SAVE20_HIGH_RATE = 0.2;
const SAVE20_LOW_RATE = 0.05;

const VIP_GOLD_HIGH_THRESHOLD = 200;
const VIP_GOLD_MID_THRESHOLD = 100;
const VIP_GOLD_HIGH_RATE = 0.25;
const VIP_GOLD_MID_RATE = 0.15;
const VIP_GOLD_LOW_RATE = 0.1;

const VIP_SILVER_THRESHOLD = 200;
const VIP_SILVER_HIGH_RATE = 0.15;
const VIP_SILVER_LOW_RATE = 0.05;

const SAVE10_RATE = 0.1;

const DOMESTIC_COUNTRY_CODE = "BT";
const FREE_SHIPPING_THRESHOLD = 100;
const MID_SHIPPING_THRESHOLD = 50;

const SHIPPING_RATES = {
  domestic: { mid: 2.99, low: 5.99 },
  international: { high: 4.99, mid: 9.99, low: 14.99 },
};

const CARD_FEE_RATES = {
  creditHigh: 0.029,
  creditMid: 0.035,
  creditLow: 0.04,
  creditFlat: 0.3,
  debitRate: 0.015,
  debitFlat: 0.15,
  unknownCardRate: 0.03,
};

const WALLET_FEE_RATE = 0.01;
const DEFAULT_FEE_RATE = 0.02;
const CARD_FEE_HIGH_THRESHOLD = 100;
const CARD_FEE_MID_THRESHOLD = 50;

module.exports = {
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
  DOMESTIC_COUNTRY_CODE,
  FREE_SHIPPING_THRESHOLD,
  MID_SHIPPING_THRESHOLD,
  SHIPPING_RATES,
  CARD_FEE_RATES,
  WALLET_FEE_RATE,
  DEFAULT_FEE_RATE,
  CARD_FEE_HIGH_THRESHOLD,
  CARD_FEE_MID_THRESHOLD,
};
