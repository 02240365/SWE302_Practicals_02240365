/**
 * Account.js
 * ---------------------------------------------------------------------------
 * Simple data model representing a single bank account.
 *
 * An Account is intentionally kept as a plain data holder (no business
 * rules live here). Business rules belong to Bank.js, which keeps this
 * class easy to reason about and easy to unit test in isolation.
 * ---------------------------------------------------------------------------
 */
class Account {
  /**
   * @param {string} accountNumber Unique identifier for the account.
   * @param {string} ownerName     Full name of the account owner.
   * @param {number} balance       Current balance of the account.
   */
  constructor(accountNumber, ownerName, balance) {
    this.accountNumber = accountNumber;
    this.ownerName = ownerName;
    this.balance = balance;
  }
}

module.exports = Account;
