// ---------------------------------------------------------------------------
// Custom commands shared by all specs (Lab 8).
// ---------------------------------------------------------------------------

/** A fresh, unused 8-digit Student ID so that every test is independent. */
Cypress.Commands.add('uniqueStudentId', () => {
  const tail = Cypress._.padStart(String(Cypress._.random(0, 999999)), 6, '0');
  return cy.wrap(`02${tail}`, { log: false });
});

/** Logs in through the login form (student by default) and waits for the dashboard. */
Cypress.Commands.add('login', (studentId, password) => {
  cy.visit('/');
  cy.get('[data-cy=student-id]').type(studentId);
  cy.get('[data-cy=password]').type(password, { log: false });
  cy.get('[data-cy=login-btn]').click();
  cy.get('[data-cy=student-shell]').should('be.visible');
});

/** Logs in with the demo student stored in fixtures/users.json. */
Cypress.Commands.add('loginAsDemoStudent', () => {
  cy.fixture('users').then(({ student }) => cy.login(student.studentId, student.password));
});

/** Creates a new student through the sign-up API and yields { studentId, password }. */
Cypress.Commands.add('createStudent', () => {
  cy.fixture('users').then((users) => {
    cy.uniqueStudentId().then((studentId) => {
      cy.request('POST', '/api/signup/student', {
        studentId,
        password: users.newStudentPassword,
        name: 'Cypress Tester',
        email: `${studentId}.cst@rub.edu.bt`,
        programme: users.programme,
      }).its('status').should('eq', 201);
      cy.wrap({ studentId, password: users.newStudentPassword });
    });
  });
});

/** Creates a new student and logs in as them. Yields { studentId, password }. */
Cypress.Commands.add('loginAsNewStudent', () => {
  cy.createStudent().then((student) => {
    cy.login(student.studentId, student.password);
    cy.wrap(student);
  });
});

/** Submits the tuition payment through the UI using fixture data. */
Cypress.Commands.add('submitPayment', () => {
  cy.fixture('payment').then(({ validTransaction }) => {
    cy.get('[data-cy=nav-payment]').click();
    cy.get('[data-cy=pay-txn]').type(validTransaction);
    cy.get('[data-cy=pay-file]').selectFile('cypress/fixtures/payment-screenshot.png', { force: true });
    cy.get('[data-cy=pay-submit]').click();
    cy.get('[data-cy=pay-result]').should('contain', 'submitted');
  });
});

/** Submits the drug test report through the UI. */
Cypress.Commands.add('submitDrugTest', () => {
  cy.get('[data-cy=nav-drugtest]').click();
  cy.get('[data-cy=drug-file]').selectFile('cypress/fixtures/drugtest-report.png', { force: true });
  cy.get('[data-cy=drug-submit]').click();
  cy.get('[data-cy=drug-result]').should('contain', 'submitted');
});

/** Acts as Registration Staff: approves or rejects a pending 'payment' or 'drugtest'. */
Cypress.Commands.add('staffDecide', (kind, studentId, approve = true) => {
  cy.fixture('users').then(({ staff }) => {
    cy.request('POST', `/api/staff/${kind}/${studentId}/decision`, {
      staffEmail: staff.email,
      approve,
      note: approve ? '' : 'Rejected by Cypress test',
    }).its('status').should('eq', 200);
  });
});

/** Registers a module through the API for a student whose payment and drug test are verified. */
Cypress.Commands.add('registerModule', (studentId, moduleCode) => {
  cy.request('POST', '/api/register', { studentId, moduleCode }).its('status').should('eq', 200);
});
