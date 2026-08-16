/**
 * deposit.test.js
 * ---------------------------------------------------------------------------
 * TDD test suite for Functionality 2: Deposit Money.
 *
 * Requirements under test:
 *  R1 - A deposit can be made to an existing account only.
 *  R2 - Deposit amount must be greater than zero.
 *  R3 - Deposit amount cannot exceed the maximum allowed per transaction.
 *  R4 - Depositing to a non-existent account should be rejected.
 * ---------------------------------------------------------------------------
 */
const Bank = require('../src/Bank');
const {
  AccountNotFoundError,
  InvalidAmountError,
  DepositLimitExceededError,
} = require('../src/errors');

describe('Bank - deposit()', () => {
  let bank;

  beforeEach(() => {
    bank = new Bank({ minimumOpeningBalance: 100, maxDepositPerTransaction: 1000000 });
    bank.openAccount('ACC001', 'Sonam Wangdi', 500);
  });

  // ---- Valid input -------------------------------------------------------
  test('should increase the account balance by the deposit amount', () => {
    const account = bank.deposit('ACC001', 250);

    expect(account.balance).toBe(750);
  });

  // ---- Boundary value: exactly the maximum allowed deposit -----------------
  test('should allow a deposit of exactly the maximum allowed amount', () => {
    const account = bank.deposit('ACC001', 1000000);

    expect(account.balance).toBe(1000500);
  });

  // ---- Business rule: exceeds maximum deposit -------------------------------
  test('should throw DepositLimitExceededError when the amount exceeds the maximum', () => {
    expect(() => bank.deposit('ACC001', 1000001)).toThrow(DepositLimitExceededError);
  });

  // ---- Invalid input: zero / negative amount ----------------------------------
  test('should throw InvalidAmountError when the deposit amount is zero', () => {
    expect(() => bank.deposit('ACC001', 0)).toThrow(InvalidAmountError);
  });

  test('should throw InvalidAmountError when the deposit amount is negative', () => {
    expect(() => bank.deposit('ACC001', -50)).toThrow(InvalidAmountError);
  });

  // ---- Invalid input: non-existent account ------------------------------------
  test('should throw AccountNotFoundError when the account does not exist', () => {
    expect(() => bank.deposit('DOES-NOT-EXIST', 100)).toThrow(AccountNotFoundError);
  });

  // ---- Exceptional condition ---------------------------------------------------
  test('should throw InvalidAmountError when the deposit amount is not a number', () => {
    expect(() => bank.deposit('ACC001', 'one hundred')).toThrow(InvalidAmountError);
  });
});
