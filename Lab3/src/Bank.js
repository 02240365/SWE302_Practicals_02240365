/**
 * Bank.js
 * ---------------------------------------------------------------------------
 * Core business logic for the Bank Account Management System.
 *
 * This class was built functionality-by-functionality using Test-Driven
 * Development (RED -> GREEN -> REFACTOR):
 *   1. openAccount() - register a new account with an initial deposit
 *   2. deposit()     - add money to an existing account
 *   3. withdraw()    - remove money from an existing account
 *   4. transfer()    - move money from one account to another
 *
 * Accounts are kept in a Map keyed by account number for O(1) lookups.
 * ---------------------------------------------------------------------------
 */

const {
  InvalidAccountDataError,
  DuplicateAccountError,
  AccountNotFoundError,
  InvalidAmountError,
  DepositLimitExceededError,
  InsufficientFundsError,
  MinimumBalanceViolationError,
  SelfTransferError,
} = require('./errors');

const Account = require('./Account');

class Bank {
  /**
   * @param {object} [options]
   * @param {number} [options.minimumOpeningBalance=100] Minimum deposit required to open an account (Nu.).
   * @param {number} [options.minimumBalance=100]          Minimum balance an account must keep at all times (Nu.).
   * @param {number} [options.maxDepositPerTransaction=1000000] Maximum allowed in a single deposit (Nu.).
   */
  constructor(options = {}) {
    this.accounts = new Map();
    this.minimumOpeningBalance = options.minimumOpeningBalance ?? 100;
    this.minimumBalance = options.minimumBalance ?? 100;
    this.maxDepositPerTransaction = options.maxDepositPerTransaction ?? 1000000;
  }

  // ---------------------------------------------------------------------
  // Functionality 1: Open a New Account
  // ---------------------------------------------------------------------
  /**
   * Opens a new account with an initial deposit.
   * @param {string} accountNumber
   * @param {string} ownerName
   * @param {number} initialDeposit
   * @returns {Account} the account that was created
   * @throws {InvalidAccountDataError} if accountNumber/ownerName are missing or blank
   * @throws {DuplicateAccountError}   if the account number already exists
   * @throws {InvalidAmountError}      if the initial deposit is below the minimum opening balance
   */
  openAccount(accountNumber, ownerName, initialDeposit) {
    if (!this._isNonEmptyString(accountNumber)) {
      throw new InvalidAccountDataError('Account number is required and cannot be empty.');
    }
    if (!this._isNonEmptyString(ownerName)) {
      throw new InvalidAccountDataError('Owner name is required and cannot be empty.');
    }
    if (this.accounts.has(accountNumber)) {
      throw new DuplicateAccountError(`An account with number "${accountNumber}" already exists.`);
    }
    if (typeof initialDeposit !== 'number' || initialDeposit < this.minimumOpeningBalance) {
      throw new InvalidAmountError(
        `Initial deposit must be at least Nu. ${this.minimumOpeningBalance} to open an account.`
      );
    }

    const account = new Account(accountNumber, ownerName, initialDeposit);
    this.accounts.set(accountNumber, account);
    return account;
  }

  // ---------------------------------------------------------------------
  // Functionality 2: Deposit Money
  // ---------------------------------------------------------------------
  /**
   * Deposits money into an existing account.
   * @param {string} accountNumber
   * @param {number} amount
   * @returns {Account} the updated account
   */
  deposit(accountNumber, amount) {
    const account = this._getAccountOrThrow(accountNumber);

    if (typeof amount !== 'number' || amount <= 0) {
      throw new InvalidAmountError('Deposit amount must be greater than zero.');
    }
    if (amount > this.maxDepositPerTransaction) {
      throw new DepositLimitExceededError(
        `Deposit amount cannot exceed Nu. ${this.maxDepositPerTransaction} in a single transaction.`
      );
    }

    account.balance += amount;
    return account;
  }

  // ---------------------------------------------------------------------
  // Functionality 3: Withdraw Money
  // ---------------------------------------------------------------------
  /**
   * Withdraws money from an existing account, enforcing the minimum balance rule.
   * @param {string} accountNumber
   * @param {number} amount
   * @returns {Account} the updated account
   */
  withdraw(accountNumber, amount) {
    const account = this._getAccountOrThrow(accountNumber);

    if (typeof amount !== 'number' || amount <= 0) {
      throw new InvalidAmountError('Withdrawal amount must be greater than zero.');
    }

    if (amount > account.balance) {
      throw new InsufficientFundsError(
        `Account "${accountNumber}" has insufficient funds for this withdrawal.`
      );
    }

    if (account.balance - amount < this.minimumBalance) {
      throw new MinimumBalanceViolationError(
        `This withdrawal would drop the balance below the required minimum of Nu. ${this.minimumBalance}.`
      );
    }

    account.balance -= amount;
    return account;
  }

  // ---------------------------------------------------------------------
  // Functionality 4: Transfer Money Between Accounts
  // ---------------------------------------------------------------------
  /**
   * Transfers money from one account to another.
   * @param {string} fromAccountNumber
   * @param {string} toAccountNumber
   * @param {number} amount
   * @returns {{ from: Account, to: Account }}
   */
  transfer(fromAccountNumber, toAccountNumber, amount) {

    if (fromAccountNumber === toAccountNumber) {
      throw new SelfTransferError('Cannot transfer money to the same account.');
    }
    const from = this._getAccountOrThrow(fromAccountNumber);
    const to = this._getAccountOrThrow(toAccountNumber);

    if (typeof amount !== 'number' || amount <= 0) {
      throw new InvalidAmountError('Transfer amount must be greater than zero.');
    }

    if (amount > from.balance) {
      throw new InsufficientFundsError(
        `Account "${fromAccountNumber}" has insufficient funds for this transfer.`
      );
    }

    if (from.balance - amount < this.minimumBalance) {
      throw new MinimumBalanceViolationError(
        `This transfer would drop the source balance below the required minimum of Nu. ${this.minimumBalance}.`
      );
    }

    from.balance -= amount;
    to.balance += amount;
    return { from, to };
  }

  // ---------------------------------------------------------------------
  // Private helpers (introduced during the REFACTOR stage to remove
  // duplication that appeared across deposit/withdraw/transfer)
  // ---------------------------------------------------------------------

  /** @private */
  _getAccountOrThrow(accountNumber) {
    const account = this.accounts.get(accountNumber);
    if (!account) {
      throw new AccountNotFoundError(`Account with number "${accountNumber}" does not exist.`);
    }
    return account;
  }

  /** @private */
  _isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }
}

module.exports = Bank;
