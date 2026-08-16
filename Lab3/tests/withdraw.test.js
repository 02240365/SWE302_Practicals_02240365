/**
 * withdraw.test.js
 * ---------------------------------------------------------------------------
 * TDD test suite for Functionality 3: Withdraw Money.
 *
 * Requirements under test:
 *  R1 - A withdrawal can be made from an existing account only.
 *  R2 - Withdrawal amount must be greater than zero.
 *  R3 - Withdrawal cannot exceed the account's available balance.
 *  R4 - The balance cannot fall below the minimum required balance after withdrawal.
 *  R5 - Withdrawing from a non-existent account should be rejected.
 * ---------------------------------------------------------------------------
 */
const Bank = require('../src/Bank');
const {
  AccountNotFoundError,
  InvalidAmountError,
  InsufficientFundsError,
  MinimumBalanceViolationError,
} = require('../src/errors');

describe('Bank - withdraw()', () => {
  let bank;

  beforeEach(() => {
    bank = new Bank({ minimumOpeningBalance: 100, minimumBalance: 100 });
    bank.openAccount('ACC001', 'Sonam Wangdi', 500);
  });

  // ---- Valid input -------------------------------------------------------
  test('should decrease the account balance by the withdrawal amount', () => {
    const account = bank.withdraw('ACC001', 200);

    expect(account.balance).toBe(300);
  });

  // ---- Boundary value: withdrawal that leaves exactly the minimum balance ---
  test('should allow a withdrawal that leaves exactly the minimum balance', () => {
    const account = bank.withdraw('ACC001', 400); // 500 - 400 = 100 (minimum)

    expect(account.balance).toBe(100);
  });

  // ---- Business rule: would drop below minimum balance -----------------------
  test('should throw MinimumBalanceViolationError when balance would fall below the minimum', () => {
    expect(() => bank.withdraw('ACC001', 450)).toThrow(MinimumBalanceViolationError); // would leave 50
  });

  // ---- Business rule: insufficient funds --------------------------------------
  test('should throw InsufficientFundsError when the withdrawal exceeds the balance', () => {
    expect(() => bank.withdraw('ACC001', 10000)).toThrow(InsufficientFundsError);
  });

  // ---- Invalid input: zero / negative amount -----------------------------------
  test('should throw InvalidAmountError when the withdrawal amount is zero', () => {
    expect(() => bank.withdraw('ACC001', 0)).toThrow(InvalidAmountError);
  });

  test('should throw InvalidAmountError when the withdrawal amount is negative', () => {
    expect(() => bank.withdraw('ACC001', -20)).toThrow(InvalidAmountError);
  });

  // ---- Invalid input: non-existent account ---------------------------------------
  test('should throw AccountNotFoundError when the account does not exist', () => {
    expect(() => bank.withdraw('DOES-NOT-EXIST', 50)).toThrow(AccountNotFoundError);
  });
});
