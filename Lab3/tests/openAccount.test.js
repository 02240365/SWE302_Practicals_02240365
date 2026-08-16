/**
 * openAccount.test.js
 * ---------------------------------------------------------------------------
 * TDD test suite for Functionality 1: Open a New Account.
 *
 * Requirements under test:
 *  R1 - Each account must have a unique account number, owner name, and initial deposit.
 *  R2 - Initial deposit must be at least Nu. 100 (minimum opening balance).
 *  R3 - Owner name must not be empty.
 *  R4 - Cannot open an account with a duplicate account number.
 * ---------------------------------------------------------------------------
 */
const Bank = require('../src/Bank');
const {
  InvalidAccountDataError,
  DuplicateAccountError,
  InvalidAmountError,
} = require('../src/errors');

describe('Bank - openAccount()', () => {
  let bank;

  beforeEach(() => {
    bank = new Bank({ minimumOpeningBalance: 100 });
  });

  // ---- Default configuration ----------------------------------------------
  test('should use the default minimum opening balance of Nu. 100 when no options are given', () => {
    const defaultBank = new Bank();

    expect(() => defaultBank.openAccount('ACC099', 'Default User', 50)).toThrow(InvalidAmountError);
    expect(defaultBank.openAccount('ACC098', 'Default User', 100).balance).toBe(100);
  });

  // ---- Valid input -------------------------------------------------------
  test('should open a new account with a valid account number, name and deposit', () => {
    const account = bank.openAccount('ACC001', 'Sonam Wangdi', 500);

    expect(account.accountNumber).toBe('ACC001');
    expect(account.ownerName).toBe('Sonam Wangdi');
    expect(account.balance).toBe(500);
  });

  // ---- Boundary value: exactly the minimum opening balance ---------------
  test('should allow opening an account with exactly the minimum opening balance', () => {
    const account = bank.openAccount('ACC002', 'Pema Choden', 100);

    expect(account.balance).toBe(100);
  });

  // ---- Business rule: below minimum opening balance -----------------------
  test('should throw InvalidAmountError when the initial deposit is below the minimum', () => {
    expect(() => bank.openAccount('ACC003', 'Tandin Dorji', 50)).toThrow(InvalidAmountError);
  });

  // ---- Business rule: duplicate account number -----------------------------
  test('should throw DuplicateAccountError when the account number already exists', () => {
    bank.openAccount('ACC004', 'Karma Yeshi', 200);

    expect(() => bank.openAccount('ACC004', 'A Different Name', 300)).toThrow(
      DuplicateAccountError
    );
  });

  // ---- Invalid / empty input -------------------------------------------------
  test('should throw InvalidAccountDataError when owner name is an empty string', () => {
    expect(() => bank.openAccount('ACC005', '   ', 200)).toThrow(InvalidAccountDataError);
  });

  test('should throw InvalidAccountDataError when account number is missing', () => {
    expect(() => bank.openAccount('', 'Dechen Lhamo', 200)).toThrow(InvalidAccountDataError);
  });

  // ---- Exceptional condition ---------------------------------------------------
  test('should throw InvalidAmountError when initial deposit is not a number', () => {
    expect(() => bank.openAccount('ACC006', 'Ugyen Tshering', 'two hundred')).toThrow(
      InvalidAmountError
    );
  });
});
