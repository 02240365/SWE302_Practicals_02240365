/**
 * errors.js
 * ---------------------------------------------------------------------------
 * Custom error types used throughout the Bank Account Management System.
 *
 * Using specific, named error classes (instead of generic `Error` or plain
 * strings) allows calling code and tests to distinguish between different
 * failure scenarios using `instanceof`, which keeps assertions in the test
 * suite precise and expressive.
 * ---------------------------------------------------------------------------
 */

/** Thrown when account data supplied is missing/invalid (e.g. empty owner name). */
class InvalidAccountDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidAccountDataError';
  }
}

/** Thrown when attempting to open an account whose account number already exists. */
class DuplicateAccountError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateAccountError';
  }
}

/** Thrown when a referenced account number does not exist in the bank. */
class AccountNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccountNotFoundError';
  }
}

/** Thrown when an amount supplied (deposit/withdraw/transfer) is invalid (zero/negative). */
class InvalidAmountError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidAmountError';
  }
}

/** Thrown when a single deposit exceeds the maximum allowed per transaction. */
class DepositLimitExceededError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DepositLimitExceededError';
  }
}

/** Thrown when a withdrawal/transfer amount exceeds the available balance. */
class InsufficientFundsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InsufficientFundsError';
  }
}

/** Thrown when an operation would drop an account below the minimum required balance. */
class MinimumBalanceViolationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MinimumBalanceViolationError';
  }
}

/** Thrown when a transfer's source and destination account are the same. */
class SelfTransferError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SelfTransferError';
  }
}

module.exports = {
  InvalidAccountDataError,
  DuplicateAccountError,
  AccountNotFoundError,
  InvalidAmountError,
  DepositLimitExceededError,
  InsufficientFundsError,
  MinimumBalanceViolationError,
  SelfTransferError,
};
