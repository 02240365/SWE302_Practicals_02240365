// payment.cy.js - Tuition payment (Lab 8)
// A new student is created and logged in before every test (custom command), so
// payments made in one test never affect another. File uploads use selectFile();
// force:true is needed because the real <input type=file> sits under a styled drop area.

describe('Tuition Payment', () => {
  // Fresh student + open the Tuition Payment tab; payment.json is loaded as this.pay.
  beforeEach(() => {
    cy.fixture('payment').as('pay');
    cy.loginAsNewStudent();
    cy.get('[data-cy=nav-payment]').click();
  });

  // VALID: PNG screenshot + 123-123456789 -> accepted, dashboard shows Pending Review.
  it('submits a valid screenshot and transaction number', function () {
    cy.get('[data-cy=pay-txn]').type(this.pay.validTransaction);
    cy.get('[data-cy=pay-file]').selectFile('cypress/fixtures/payment-screenshot.png', { force: true });
    cy.get('[data-cy=pay-submit]').click();
    cy.get('[data-cy=pay-result]').should('contain', 'submitted');
    cy.get('[data-cy=stat-payment]').should('contain', 'Pending');
  });

  // INVALID FILE: a .txt file must be refused with the JPG/JPEG/PNG message.
  it('rejects a file that is not an image', function () {
    cy.get('[data-cy=pay-txn]').type(this.pay.validTransaction);
    cy.get('[data-cy=pay-file]').selectFile('cypress/fixtures/notes.txt', { force: true });
    cy.get('[data-cy=pay-submit]').click();
    cy.get('[data-cy=pay-result]').should('contain', this.pay.messages.badFile);
  });

  // MISSING FILE: the screenshot is mandatory.
  it('rejects a submission with no screenshot', function () {
    cy.get('[data-cy=pay-txn]').type(this.pay.validTransaction);
    cy.get('[data-cy=pay-submit]').click();
    cy.get('[data-cy=pay-result]').should('contain', this.pay.messages.noFile);
  });

  // INVALID FORMAT: '12-123456789' has only 2 digits before the hyphen.
  it('rejects an invalid transaction number format', function () {
    cy.get('[data-cy=pay-txn]').type(this.pay.badTransactions[0]);
    cy.get('[data-cy=pay-file]').selectFile('cypress/fixtures/payment-screenshot.png', { force: true });
    cy.get('[data-cy=pay-submit]').click();
    cy.get('[data-cy=pay-result]').should('contain', this.pay.messages.badTransaction);
  });

  // MISSING NUMBER: file attached but transaction number left blank.
  it('rejects an empty transaction number', () => {
    cy.get('[data-cy=pay-file]').selectFile('cypress/fixtures/payment-screenshot.png', { force: true });
    cy.get('[data-cy=pay-submit]').click();
    cy.get('[data-cy=pay-result]').should('contain', 'Transaction number is mandatory');
  });
});
