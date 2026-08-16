# SWE302 — Lab 3 Step-by-Step Guide
## Practicing Test-Driven Development (TDD)
### System: Bank Account Management System

This guide walks you through completing Lab 3 from start to finish using the
`bank-account-management-system.zip` project provided. Follow every command
exactly, in order. Each screenshot is numbered (**Screenshot 1** to
**Screenshot 14**) and matches the placeholder boxes in `Lab3_Report.docx` —
so when you finish a step, just drop the screenshot straight into the
matching box in the report.

---

## Before you start

Open a terminal and confirm you have Node.js installed:

```bash
node -v
npm -v
```

You should see version numbers (e.g. `v18.x` or higher). If you get
"command not found", install Node.js from https://nodejs.org first.

---

## Activity 1 & 2 — System and Requirements (already defined for you)

**System:** Bank Account Management System — a small system that manages
customer bank accounts: opening accounts, depositing, withdrawing, and
transferring money between accounts.

**Functionalities (4, one more than the minimum of 3 required):**
1. Open a New Account
2. Deposit Money
3. Withdraw Money
4. Transfer Money Between Accounts

**Requirements** (write these into your report in Section 3.2 — they are
already implemented and tested in the code, and are what every test case
below is based on):

**1. Open a New Account**
- Each account must have a unique account number, owner name, and initial deposit.
- Initial deposit must be at least Nu. 100 (minimum opening balance).
- Owner name must not be empty.
- Cannot open an account with a duplicate account number.

**2. Deposit Money**
- A deposit can be made to an existing account only.
- Deposit amount must be greater than zero.
- Deposit amount cannot exceed Nu. 1,000,000 in a single transaction.
- Depositing to a non-existent account should be rejected.

**3. Withdraw Money**
- A withdrawal can be made from an existing account only.
- Withdrawal amount must be greater than zero.
- Withdrawal cannot exceed the account's available balance.
- The balance cannot fall below the minimum required balance of Nu. 100 after withdrawal.
- Withdrawing from a non-existent account should be rejected.

**4. Transfer Money Between Accounts**
- A transfer moves money from one existing account to another existing account.
- The source account must have sufficient funds and keep the minimum balance.
- Transfer amount must be greater than zero.
- Cannot transfer to the same account (self-transfer rejected).
- Transferring from/to a non-existent account should be rejected.

---

## Activity 3 — Set Up the Project

Run these commands one by one in your terminal:

```bash
# 1. Unzip the provided project (adjust the path to wherever you downloaded it)
unzip bank-account-management-system.zip
cd bank-account-management-system

# 2. Install Jest (the testing framework) as listed in package.json
npm install

# 3. Confirm the project structure
ls -R
```

You should see output showing:

```
bank-account-management-system/
├── package.json
├── README.md
├── src/
│   ├── Account.js
│   ├── Bank.js
│   └── errors.js
└── tests/
    ├── openAccount.test.js
    ├── deposit.test.js
    ├── withdraw.test.js
    └── transfer.test.js
```

Notice production code (`src/`) and test code (`tests/`) are kept in
separate folders — this satisfies the "organize your project" requirement.

📸 **Screenshot 1 — Project Setup:** run `ls -R` (or open the folder in VS
Code) and screenshot the folder structure, showing `src/` and `tests/`
clearly separated. Also fine to include the `npm install` success output.

---

## How the RED → GREEN → REFACTOR cycle works in this guide

For **each** of the 4 functionalities below, you will:

1. **Empty out** the relevant method in `src/Bank.js` (turn it into a stub).
2. **Uncomment tests one at a time** in the matching test file, starting from
   the first one.
3. Run `npm test` → confirm it **fails** (RED).
4. Add just enough code to `src/Bank.js` to make that test pass.
5. Run `npm test` → confirm it **passes** (GREEN).
6. Repeat steps 2–5 for every remaining test in that file.
7. Once **all** tests in that file pass, **refactor** (clean up duplication),
   then run `npm test` again to confirm everything still passes (REFACTOR).

The full, correct code for every stage is shown below so you can copy it
exactly — you don't need to guess what to write.

---

## Functionality 1: Open a New Account

### Step 1.1 — Stub the method (make it empty)

Open `src/Bank.js` in your editor and temporarily replace the `openAccount`
method body with a stub:

```javascript
openAccount(accountNumber, ownerName, initialDeposit) {
  // TODO: implement (TDD in progress)
}
```

### Step 1.2 — RED: uncomment only the first test

Open `tests/openAccount.test.js`. Temporarily comment out (`//` or wrap in
`/* */`) every test **except** the first one:

```javascript
test('should open a new account with a valid account number, name and deposit', () => {
  const account = bank.openAccount('ACC001', 'Sonam Wangdi', 500);

  expect(account.accountNumber).toBe('ACC001');
  expect(account.ownerName).toBe('Sonam Wangdi');
  expect(account.balance).toBe(500);
});
```

Run:

```bash
npx jest tests/openAccount.test.js
```

The test should **fail** — `account` will be `undefined` because
`openAccount()` doesn't return anything yet.

📸 **Screenshot 2 — RED (Open a New Account):** terminal showing this
failing test in red, with the error message about `account` being undefined.

### Step 1.3 — GREEN: minimum code to pass

Update `openAccount` in `src/Bank.js`:

```javascript
openAccount(accountNumber, ownerName, initialDeposit) {
  const account = new Account(accountNumber, ownerName, initialDeposit);
  this.accounts.set(accountNumber, account);
  return account;
}
```

Run again:

```bash
npx jest tests/openAccount.test.js
```

The test should now **pass**.

📸 **Screenshot 3 — GREEN (Open a New Account):** terminal showing this test
passing in green.

### Step 1.4 — Repeat RED → GREEN for the remaining tests

Uncomment the remaining tests **one at a time**, in this order. After
uncommenting each one, run `npx jest tests/openAccount.test.js` to see it
fail first (RED), then add the matching code below to `openAccount()`, then
run again to see it pass (GREEN).

1. `should use the default minimum opening balance...` → passes once the
   constructor default (`options.minimumOpeningBalance ?? 100`) exists,
   already present — confirm GREEN.
2. `should allow opening an account with exactly the minimum opening balance`
   → passes with current code — confirm GREEN.
3. `should throw InvalidAmountError when the initial deposit is below the minimum`
   → RED first (no check exists) → add:
   ```javascript
   if (typeof initialDeposit !== 'number' || initialDeposit < this.minimumOpeningBalance) {
     throw new InvalidAmountError(
       `Initial deposit must be at least Nu. ${this.minimumOpeningBalance} to open an account.`
     );
   }
   ```
   → GREEN.
4. `should throw DuplicateAccountError when the account number already exists`
   → RED first → add:
   ```javascript
   if (this.accounts.has(accountNumber)) {
     throw new DuplicateAccountError(`An account with number "${accountNumber}" already exists.`);
   }
   ```
   → GREEN.
5. `should throw InvalidAccountDataError when owner name is an empty string`
6. `should throw InvalidAccountDataError when account number is missing`
   → RED first → add:
   ```javascript
   if (!this._isNonEmptyString(accountNumber)) {
     throw new InvalidAccountDataError('Account number is required and cannot be empty.');
   }
   if (!this._isNonEmptyString(ownerName)) {
     throw new InvalidAccountDataError('Owner name is required and cannot be empty.');
   }
   ```
   → GREEN for both.
7. `should throw InvalidAmountError when initial deposit is not a number`
   → should already pass because of the `typeof initialDeposit !== 'number'`
   check above — confirm GREEN.

Make sure all validation checks are placed in the correct order at the very
start of `openAccount()` (account number check → owner name check → duplicate
check → deposit amount check), matching the final version in the provided
`src/Bank.js`.

### Step 1.5 — REFACTOR

With all 7 tests in `tests/openAccount.test.js` passing, look at the code:
- The repeated pattern `typeof x !== 'string' || x.trim().length === 0` can
  be extracted into a small private helper `_isNonEmptyString(value)`.

Add the helper to the bottom of the `Bank` class:

```javascript
_isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
```

And simplify the checks to use it:

```javascript
if (!this._isNonEmptyString(accountNumber)) { ... }
if (!this._isNonEmptyString(ownerName)) { ... }
```

Run the full suite to make sure nothing broke:

```bash
npx jest tests/openAccount.test.js
```

📸 **Screenshot 4 — REFACTOR (Open a New Account):** terminal showing all 7
`openAccount` tests still passing after the refactor.

---

## Functionality 2: Deposit Money

### Step 2.1 — Stub the method

```javascript
deposit(accountNumber, amount) {
  // TODO: implement (TDD in progress)
}
```

### Step 2.2 — RED: uncomment only the first test in `tests/deposit.test.js`

```javascript
test('should increase the account balance by the deposit amount', () => {
  const account = bank.deposit('ACC001', 250);

  expect(account.balance).toBe(750);
});
```

Run:

```bash
npx jest tests/deposit.test.js
```

📸 **Screenshot 5 — RED (Deposit Money):** terminal showing this failing test.

### Step 2.3 — GREEN

```javascript
deposit(accountNumber, amount) {
  const account = this.accounts.get(accountNumber);
  account.balance += amount;
  return account;
}
```

Run again — it should pass.

📸 **Screenshot 6 — GREEN (Deposit Money):** terminal showing the test passing.

### Step 2.4 — Repeat for remaining tests

Uncomment one at a time and extend the implementation:

1. `should allow a deposit of exactly the maximum allowed amount` → passes
   already — confirm GREEN.
2. `should throw DepositLimitExceededError when the amount exceeds the maximum`
   → RED → add:
   ```javascript
   if (amount > this.maxDepositPerTransaction) {
     throw new DepositLimitExceededError(
       `Deposit amount cannot exceed Nu. ${this.maxDepositPerTransaction} in a single transaction.`
     );
   }
   ```
   → GREEN.
3. `should throw InvalidAmountError when the deposit amount is zero`
4. `should throw InvalidAmountError when the deposit amount is negative`
5. `should throw InvalidAmountError when the deposit amount is not a number`
   → RED → add:
   ```javascript
   if (typeof amount !== 'number' || amount <= 0) {
     throw new InvalidAmountError('Deposit amount must be greater than zero.');
   }
   ```
   → GREEN for all three.
6. `should throw AccountNotFoundError when the account does not exist`
   → RED (currently `account` would be `undefined` and `.balance` would
   crash with a generic TypeError, not the correct custom error) → add a
   lookup guard at the top of the method:
   ```javascript
   const account = this.accounts.get(accountNumber);
   if (!account) {
     throw new AccountNotFoundError(`Account with number "${accountNumber}" does not exist.`);
   }
   ```
   → GREEN.

Order matters: look the account up and validate it exists **first**, then
validate the amount.

### Step 2.5 — REFACTOR

Notice the "look up the account, throw if missing" logic will be repeated in
`withdraw()` and `transfer()` too. Extract it now into a shared private
helper:

```javascript
_getAccountOrThrow(accountNumber) {
  const account = this.accounts.get(accountNumber);
  if (!account) {
    throw new AccountNotFoundError(`Account with number "${accountNumber}" does not exist.`);
  }
  return account;
}
```

Update `deposit()` to use it:

```javascript
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
```

Run:

```bash
npx jest tests/deposit.test.js
```

📸 **Screenshot 7 — REFACTOR (Deposit Money):** terminal showing all
`deposit` tests still passing after the refactor.

---

## Functionality 3: Withdraw Money

### Step 3.1 — Stub the method

```javascript
withdraw(accountNumber, amount) {
  // TODO: implement (TDD in progress)
}
```

### Step 3.2 — RED: uncomment only the first test in `tests/withdraw.test.js`

```javascript
test('should decrease the account balance by the withdrawal amount', () => {
  const account = bank.withdraw('ACC001', 200);

  expect(account.balance).toBe(300);
});
```

Run:

```bash
npx jest tests/withdraw.test.js
```

📸 **Screenshot 8 — RED (Withdraw Money):** terminal showing this failing test.

### Step 3.3 — GREEN

```javascript
withdraw(accountNumber, amount) {
  const account = this._getAccountOrThrow(accountNumber);
  account.balance -= amount;
  return account;
}
```

Run again — it should pass.

📸 **Screenshot 9 — GREEN (Withdraw Money):** terminal showing the test passing.

### Step 3.4 — Repeat for remaining tests

1. `should allow a withdrawal that leaves exactly the minimum balance` → will
   fail until the minimum-balance check exists — see step below.
2. `should throw MinimumBalanceViolationError when balance would fall below the minimum`
   → RED → add:
   ```javascript
   if (account.balance - amount < this.minimumBalance) {
     throw new MinimumBalanceViolationError(
       `This withdrawal would drop the balance below the required minimum of Nu. ${this.minimumBalance}.`
     );
   }
   ```
   → GREEN (this also makes test 1 above pass).
3. `should throw InsufficientFundsError when the withdrawal exceeds the balance`
   → RED → add (place this check **before** the minimum-balance check):
   ```javascript
   if (amount > account.balance) {
     throw new InsufficientFundsError(
       `Account "${accountNumber}" has insufficient funds for this withdrawal.`
     );
   }
   ```
   → GREEN.
4. `should throw InvalidAmountError when the withdrawal amount is zero`
5. `should throw InvalidAmountError when the withdrawal amount is negative`
   → RED → add at the very top (right after the account lookup):
   ```javascript
   if (typeof amount !== 'number' || amount <= 0) {
     throw new InvalidAmountError('Withdrawal amount must be greater than zero.');
   }
   ```
   → GREEN.
6. `should throw AccountNotFoundError when the account does not exist` →
   already GREEN, since `_getAccountOrThrow()` is used from the start.

The correct check order inside `withdraw()` is: account exists → amount is
valid → sufficient funds → minimum balance respected.

### Step 3.5 — REFACTOR

`withdraw()` should now closely resemble `deposit()` in shape (lookup, then
validate, then apply). Re-read the method and confirm:
- Variable and method names are clear (`amount`, not `x` or `val`).
- No duplicate logic remains that could be extracted further.

Run:

```bash
npx jest tests/withdraw.test.js
```

📸 **Screenshot 10 — REFACTOR (Withdraw Money):** terminal showing all
`withdraw` tests still passing after review/refactor.

---

## Functionality 4: Transfer Money Between Accounts

### Step 4.1 — Stub the method

```javascript
transfer(fromAccountNumber, toAccountNumber, amount) {
  // TODO: implement (TDD in progress)
}
```

### Step 4.2 — RED: uncomment only the first test in `tests/transfer.test.js`

```javascript
test('should move the amount from the source account to the destination account', () => {
  const result = bank.transfer('ACC001', 'ACC002', 200);

  expect(result.from.balance).toBe(300);
  expect(result.to.balance).toBe(500);
});
```

Run:

```bash
npx jest tests/transfer.test.js
```

📸 **Screenshot 11 — RED (Transfer Money):** terminal showing this failing test.

### Step 4.3 — GREEN

```javascript
transfer(fromAccountNumber, toAccountNumber, amount) {
  const from = this._getAccountOrThrow(fromAccountNumber);
  const to = this._getAccountOrThrow(toAccountNumber);
  from.balance -= amount;
  to.balance += amount;
  return { from, to };
}
```

Run again — it should pass.

📸 **Screenshot 12 — GREEN (Transfer Money):** terminal showing the test passing.

### Step 4.4 — Repeat for remaining tests

1. `should allow a transfer that leaves the source at exactly the minimum balance`
2. `should throw MinimumBalanceViolationError when the source would fall below the minimum`
   → RED → add:
   ```javascript
   if (from.balance - amount < this.minimumBalance) {
     throw new MinimumBalanceViolationError(
       `This transfer would drop the source balance below the required minimum of Nu. ${this.minimumBalance}.`
     );
   }
   ```
   → GREEN for both.
3. `should throw InsufficientFundsError when the source has insufficient funds`
   → RED → add (before the minimum-balance check):
   ```javascript
   if (amount > from.balance) {
     throw new InsufficientFundsError(
       `Account "${fromAccountNumber}" has insufficient funds for this transfer.`
     );
   }
   ```
   → GREEN.
4. `should throw SelfTransferError when source and destination are the same account`
   → RED → add this check **first**, before even looking up the accounts:
   ```javascript
   if (fromAccountNumber === toAccountNumber) {
     throw new SelfTransferError('Cannot transfer money to the same account.');
   }
   ```
   → GREEN.
5. `should throw InvalidAmountError when the transfer amount is zero`
   → RED → add after both accounts are looked up:
   ```javascript
   if (typeof amount !== 'number' || amount <= 0) {
     throw new InvalidAmountError('Transfer amount must be greater than zero.');
   }
   ```
   → GREEN.
6. `should throw AccountNotFoundError when the source account does not exist`
7. `should throw AccountNotFoundError when the destination account does not exist`
   → already GREEN, since both accounts are looked up with
   `_getAccountOrThrow()` from the start.

Final check order inside `transfer()`: same account check → source account
exists → destination account exists → amount is valid → sufficient funds →
minimum balance respected → apply the transfer.

### Step 4.5 — REFACTOR

Review `transfer()` for clarity — since it reuses `_getAccountOrThrow()`, it
should already be free of duplicated lookup logic. Confirm the method reads
top-to-bottom as: validate → apply.

Run:

```bash
npx jest tests/transfer.test.js
```

📸 **Screenshot 13 — REFACTOR (Transfer Money):** terminal showing all
`transfer` tests still passing after review/refactor.

---

## Activity 8 — Test Different Scenarios (already satisfied)

Check that, across your four test files, you have covered:
- ✅ Valid input (e.g. `should open a new account with a valid account number...`)
- ✅ Invalid input (e.g. `should throw InvalidAmountError when the deposit amount is zero`)
- ✅ Boundary values (e.g. `should allow opening an account with exactly the minimum opening balance`)
- ✅ Business rule violations (e.g. `DuplicateAccountError`, `SelfTransferError`, `MinimumBalanceViolationError`)
- ✅ Exceptional conditions (e.g. `AccountNotFoundError`, non-numeric amount)

This is already true in the provided test files — just be ready to explain
which test covers which scenario type if asked.

---

## Activity 9 — Run the Complete Test Suite

Once all four functionalities are implemented and every individual test file
passes, run everything together with coverage:

```bash
npm run test:coverage
```

Confirm:
- All test suites pass (`4 passed, 4 total`)
- All 30 tests pass (`30 passed, 30 total`)
- Coverage is 100% statements, branches, functions, and lines (if you typed
  the code exactly as shown above)

📸 **Screenshot 14 — Full Test Suite & Coverage:** terminal showing the
complete `npm run test:coverage` output — all suites passing and the
coverage summary table.

If anything fails at this stage:
1. Read the Jest error message carefully — it tells you the expected vs.
   received value and the exact line that failed.
2. Fix the implementation (or the test, if the test itself was wrong).
3. Re-run `npm run test:coverage`.
4. Confirm the previously-passing tests are still passing (no regressions).

---

## Putting Together Your Report

Open `Lab3_Report.docx`. It already contains the Aim, Objectives, system
description, requirements, and explanations of each TDD stage, matching your
Lab 2 report's format. You only need to:

1. Insert Screenshots 1–14 into their matching numbered placeholder boxes.
2. Fill in your actual coverage percentages if they differ from 100%.
3. Update the student details on the cover page if needed.
4. Proofread and submit.

---

## Tips for a High-Scoring Submission

- Make sure your RED screenshots clearly show **red/failing** output, and
  your GREEN screenshots clearly show **passing** output — this is the
  clearest evidence you actually followed TDD rather than writing the code
  first.
- Keep your terminal font large enough to be readable in a screenshot, and
  make sure the command you typed (`npx jest ...` or `npm test`) is visible
  at the top of the screenshot, not just the result.
- In your report, briefly explain *why* each refactor was done (e.g.
  "extracted `_getAccountOrThrow()` to remove duplicated lookup logic from
  deposit, withdraw and transfer") — this shows understanding, not just
  execution.
- If you use Git, commit after each RED, GREEN, and REFACTOR step with clear
  messages (e.g. `test: add failing test for deposit`, `feat: implement
  deposit to pass test`, `refactor: extract _getAccountOrThrow helper`).
  This is optional but is strong additional evidence of following the
  process properly.
