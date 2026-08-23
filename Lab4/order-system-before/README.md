# Order System (Before Refactor)

A small order-processing module used as the "before" baseline for
SWE302 Lab 4 (Refactoring for testability + SonarQube analysis).

`src/orderProcessor.js` intentionally packs validation, pricing,
discount rules, shipping rules, payment-fee rules, persistence and
"email sending" into a single long function, with duplicated logic
copy-pasted into `src/refundProcessor.js`. It is not meant to be run
in production — it exists to be analyzed by SonarQube and then
refactored (see the `order-system-after` project).

## Run analysis

```bash
sonar-scanner \
  -Dsonar.projectKey=order-system-before \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=<YOUR_TOKEN>
```
