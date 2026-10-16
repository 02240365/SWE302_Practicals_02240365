// Feature enhanced in Lab 7: staff verification tracking on the student
// dashboard, plus the usability fixes U1/U4 (pending grades), U5 (Programme
// drop-down) and U6 (login error recovery).
describe('Enhancement: staff verification tracking and usability fixes', () => {
  // The page polls the server every 8 s, so the status must change with no reload.
  it('U2: dashboard shows "Verified" by itself after staff approve, without a reload', () => {
    cy.loginAsNewStudent().then(({ studentId }) => {
      cy.submitPayment();
      cy.get('[data-cy=nav-dashboard]').click();
      cy.get('[data-cy=stat-payment]').should('contain', 'Pending');

      cy.staffDecide('payment', studentId, true);

      // The page polls every 8 s, so allow slightly more than one cycle.
      cy.get('[data-cy=stat-payment]', { timeout: 15000 }).should('contain', 'Verified');
    });
  });

  // Toast message shown when staff approve (added to fix U2).
  it('U2: a notification appears when staff approve the payment', () => {
    cy.loginAsNewStudent().then(({ studentId }) => {
      cy.submitPayment();
      cy.staffDecide('payment', studentId, true);
      cy.get('[data-cy=toast]', { timeout: 15000 })
        .should('contain', 'Tuition payment verified');
    });
  });

  // INVALID path: staff reject the payment -> status no longer 'Pending' and a warning toast shows.
  it('U2: a rejected payment is reported on the dashboard', () => {
    cy.loginAsNewStudent().then(({ studentId }) => {
      cy.submitPayment();
      cy.staffDecide('payment', studentId, false);
      cy.get('[data-cy=stat-payment]', { timeout: 15000 }).should('not.contain', 'Pending');
      cy.get('[data-cy=toast]', { timeout: 15000 }).should('contain', 'rejected');
    });
  });

  // Setup through the API (approve payment and drug test, register SWE303), then
  // check that a Pending grade comes with an explanatory notice.
  it('U1/U4: pending grades are explained on the Results page', () => {
    cy.loginAsNewStudent().then(({ studentId }) => {
      cy.submitPayment();
      cy.submitDrugTest();
      cy.staffDecide('payment', studentId, true);
      cy.staffDecide('drugtest', studentId, true);
      cy.registerModule(studentId, 'SWE303');

      cy.get('[data-cy=nav-results]').click();
      cy.get('[data-cy=pending-notice]').should('contain', 'awaiting grades');
      cy.get('[data-cy=result-grade]').first().should('contain', 'Pending');
    });
  });

  // Programme must be a <select> with the CST programmes, not a free-text input.
  it('U5: Programme is chosen from a drop-down list on Create Account', () => {
    cy.visit('/');
    cy.get('[data-cy=tab-signup]').click();
    cy.get('[data-cy=signup-programme]').should('match', 'select');
    cy.get('[data-cy=signup-programme] option').should('have.length.greaterThan', 5);
    cy.get('[data-cy=signup-programme]').select('BE Software Engineering')
      .should('have.value', 'BE Software Engineering');
  });

  // Error message must tell a first-time user to create an account, and the link must work.
  it('U6: a failed login points a new user to "Create an account"', () => {
    cy.fixture('users').then(({ invalid, student }) => {
      cy.visit('/');
      cy.get('[data-cy=student-id]').type(invalid.unknownId);
      cy.get('[data-cy=password]').type(student.password);
      cy.get('[data-cy=login-btn]').click();
      cy.get('[data-cy=error]').should('contain', 'Create an account');
      cy.get('[data-cy=switch-to-signup]').click();
      cy.get('[data-cy=signup-btn]').should('be.visible');
    });
  });
});
