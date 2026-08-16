/**
 * transfer.test.js
 * ---------------------------------------------------------------------------
 * TDD test suite for Functionality 4: Transfer Money Between Accounts.
 *
 * Requirements under test:
 *  R1 - A transfer moves money from one existing account to another existing account.
 *  R2 - The source account must have sufficient funds and respect the minimum balance rule.
 *  R3 - Transfer amount must be greater than zero.
 *  R4 - Cannot transfer to the same account (self-transfer rejected).
 *  R5 - Transferring from/to a non-existent account should be rejected.
 * ---------------------------------------------------------------------------
 */
const Bank = require('../src/Bank');
const {
  AccountNotFoundError,
  InvalidAmountError,
  InsufficientFundsError,
  MinimumBalanceViolationError,
  SelfTransferError,
} = require('../src/errors');

describe('Bank - transfer()', () => {
  let bank;

  beforeEach(() => {
    bank = new Bank({ minimumOpeningBalance: 100, minimumBalance: 100 });
    bank.openAccount('ACC001', 'Sonam Wangdi', 500);
    bank.openAccount('ACC002', 'Pema Choden', 300);
  });

  // ---- Valid input -------------------------------------------------------
  test('should move the amount from the source account to the destination account', () => {
    const result = bank.transfer('ACC001', 'ACC002', 200);

    expect(result.from.balance).toBe(300);
    expect(result.to.balance).toBe(500);
  });

  // ---- Boundary value: transfer that leaves exactly the minimum balance -----
  test('should allow a transfer that leaves the source at exactly the minimum balance', () => {
    const result = bank.transfer('ACC001', 'ACC002', 400); // 500 - 400 = 100 (minimum)

    expect(result.from.balance).toBe(100);
  });

  // ---- Business rule: would drop source below minimum balance -----------------
  test('should throw MinimumBalanceViolationError when the source would fall below the minimum', () => {
    expect(() => bank.transfer('ACC001', 'ACC002', 450)).toThrow(MinimumBalanceViolationError);
  });

  // ---- Business rule: insufficient funds ----------------------------------------
  test('should throw InsufficientFundsError when the source has insufficient funds', () => {
    expect(() => bank.transfer('ACC001', 'ACC002', 10000)).toThrow(InsufficientFundsError);
  });

  // ---- Business rule violation: self-transfer -------------------------------------
  test('should throw SelfTransferError when source and destination are the same account', () => {
    expect(() => bank.transfer('ACC001', 'ACC001', 100)).toThrow(SelfTransferError);
  });

  // ---- Invalid input: zero / negative amount ---------------------------------------
  test('should throw InvalidAmountError when the transfer amount is zero', () => {
    expect(() => bank.transfer('ACC001', 'ACC002', 0)).toThrow(InvalidAmountError);
  });

  // ---- Invalid input: non-existent accounts -------------------------------------------
  test('should throw AccountNotFoundError when the source account does not exist', () => {
    expect(() => bank.transfer('DOES-NOT-EXIST', 'ACC002', 100)).toThrow(AccountNotFoundError);
  });

  test('should throw AccountNotFoundError when the destination account does not exist', () => {
    expect(() => bank.transfer('ACC001', 'DOES-NOT-EXIST', 100)).toThrow(AccountNotFoundError);
  });
});
