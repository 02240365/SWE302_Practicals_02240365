# Bank Account Management System — Built with Test-Driven Development (TDD)

**SWE302 — Lab 3: Practicing Test-Driven Development (TDD)**

## 1. System Description

A small, self-contained **Bank Account Management System** implemented in
Node.js. The system is deliberately kept small (no database, no UI) so that
the focus stays on practicing the **RED → GREEN → REFACTOR** TDD cycle rather
than on building a complete application.

## 2. Functionalities (developed using TDD)

| # | Functionality                     | Implemented in                      | Tested in                     |
|---|-------------------------------------|---------------------------------------|--------------------------------|
| 1 | Open a New Account                   | `src/Bank.js` → `openAccount()`      | `tests/openAccount.test.js`    |
| 2 | Deposit Money                          | `src/Bank.js` → `deposit()`           | `tests/deposit.test.js`         |
| 3 | Withdraw Money                          | `src/Bank.js` → `withdraw()`          | `tests/withdraw.test.js`        |
| 4 | Transfer Money Between Accounts          | `src/Bank.js` → `transfer()`          | `tests/transfer.test.js`        |

## 3. Project Structure

```
bank-account-management-system/
├── package.json
├── README.md
├── src/
│   ├── Account.js     # Account data model
│   ├── Bank.js         # Core business logic (production code)
│   └── errors.js         # Custom, named error types
└── tests/
    ├── openAccount.test.js
    ├── deposit.test.js
    ├── withdraw.test.js
    └── transfer.test.js
```

## 4. How to Run

```bash
npm install               # install Jest
npm test                    # run all tests
npm run test:coverage    # run all tests with a coverage report
```

## 5. TDD Process Followed

Each functionality was developed strictly in this order:

1. **RED** — A test describing the required behaviour was written first, then
   run to confirm it failed (because no production code existed yet).
2. **GREEN** — The minimum amount of production code needed to make the test
   pass was written, then the test was re-run to confirm it passed.
3. **REFACTOR** — The code was cleaned up (better names, removed duplication,
   extracted helper methods) while re-running the tests to make sure nothing
   broke.

This cycle was repeated for all four functionalities. See the accompanying
lab guide/report for the detailed step-by-step history and screenshots.

## 6. Test Scenarios Covered

For every functionality, the test suite covers:
- Valid ("happy path") input
- Invalid input
- Boundary values (e.g. exactly the minimum opening balance, exactly the
  minimum balance left after a withdrawal/transfer)
- Business rule violations (e.g. duplicate account number, self-transfer,
  minimum balance violation)
- Exceptional conditions (e.g. non-existent account, non-numeric amount)

## 7. Result

- **30 automated tests**, all passing
- **100% statement, branch, function, and line coverage** across `src/`
