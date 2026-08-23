# Order System (After Refactor)

The refactored version of `order-system-before`, restructured for
readability and testability while keeping identical business rules and
output values.

## What changed

- One 190-line function → 9 small, single-responsibility modules
  (`OrderValidator`, `PricingCalculator`, `DiscountCalculator`,
  `ShippingCalculator`, `PaymentFeeCalculator`, `OrderRepository`,
  `NotificationService`, `OrderService`, `utils`).
- All magic numbers moved into `constants.js`.
- Nested if/else-if chains replaced with data-driven strategy maps.
- Global mutable array replaced with an injectable `OrderRepository`
  instance.
- Direct `Math.random()` / `new Date()` calls replaced with injectable
  `RandomIdGenerator` / `SystemClock` so business logic is deterministic
  in tests.
- Hardcoded API key removed entirely.
- `==` replaced with `===`; empty `catch` block removed; `var` replaced
  with `const`/`let`.
- Errors are thrown as typed `ValidationError` / `OrderNotFoundError`
  instances instead of returned as ad-hoc strings.

## Install & test

```bash
npm install
npm run test:coverage
```

## Run SonarQube analysis

```bash
sonar-scanner \
  -Dsonar.projectKey=order-system-after \
  -Dsonar.sources=src \
  -Dsonar.tests=tests \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=<YOUR_TOKEN>
```
