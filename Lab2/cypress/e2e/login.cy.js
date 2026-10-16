// login.cy.js - Student login (Lab 8)
// Covers the valid path and the invalid cases required by the lab: wrong format,
// empty fields and wrong password. Test data comes from fixtures/users.json.
// Every test opens a fresh login page in beforeEach, so tests are independent.

describe('Student Login', () => {
  // Load the fixture once as this.users and open the login page before every test.
  beforeEach(() => {
    cy.fixture('users').as('users');
    cy.visit('/');
  });

  // VALID: correct Student ID + password -> dashboard shown with the student's ID.
  it('reaches the dashboard with a valid Student ID and password', function () {
    cy.get('[data-cy=student-id]').type(this.users.student.studentId);
    cy.get('[data-cy=password]').type(this.users.student.password);
    cy.get('[data-cy=login-btn]').click();
    cy.get('[data-cy=student-shell]').should('be.visible');
    cy.get('[data-cy=session-id]').should('contain', this.users.student.studentId);
  });

  // INVALID FORMAT: ID shorter than 8 digits -> server validation message, no dashboard.
  it('shows an error for a 7-digit Student ID', function () {
    cy.get('[data-cy=student-id]').type(this.users.invalid.shortId);
    cy.get('[data-cy=password]').type(this.users.student.password);
    cy.get('[data-cy=login-btn]').click();
    cy.get('[data-cy=error]').should('contain', '8 digits');
    cy.get('[data-cy=student-shell]').should('not.be.visible');
  });

  // INVALID FORMAT: ID contains a letter -> 'numbers only' message.
  it('shows an error for a Student ID containing a letter', function () {
    cy.get('[data-cy=student-id]').type(this.users.invalid.letterId);
    cy.get('[data-cy=password]').type(this.users.student.password);
    cy.get('[data-cy=login-btn]').click();
    cy.get('[data-cy=error]').should('contain', 'numbers only');
  });

  // EMPTY FIELDS: submitting the blank form must be rejected.
  it('rejects empty fields', () => {
    cy.get('[data-cy=login-btn]').click();
    cy.get('[data-cy=error]').should('contain', 'Student ID is mandatory');
    cy.get('[data-cy=student-shell]').should('not.be.visible');
  });

  // EMPTY PASSWORD: ID filled in, password left blank.
  it('rejects an empty password', function () {
    cy.get('[data-cy=student-id]').type(this.users.student.studentId);
    cy.get('[data-cy=login-btn]').click();
    cy.get('[data-cy=error]').should('contain', 'Password is mandatory');
  });

  // WRONG PASSWORD: well-formed credentials that do not match any account.
  it('rejects a wrong password', function () {
    cy.get('[data-cy=student-id]').type(this.users.student.studentId);
    cy.get('[data-cy=password]').type(this.users.invalid.wrongPassword);
    cy.get('[data-cy=login-btn]').click();
    cy.get('[data-cy=error]').should('contain', 'Invalid Student ID or Password');
    cy.get('[data-cy=student-shell]').should('not.be.visible');
  });

  // cy.loginAsDemoStudent() is the custom command that avoids repeating the login steps.
  it('logs the student out and returns to the login form', () => {
    cy.loginAsDemoStudent();
    cy.get('[data-cy=logout]').click();
    cy.get('[data-cy=login-btn]').should('be.visible');
    cy.get('[data-cy=student-shell]').should('not.be.visible');
  });
});
