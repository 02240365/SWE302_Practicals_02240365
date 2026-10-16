// results.cy.js - Semester results (Lab 8)
// The demo student (SWE301 = A) is only read, never changed, so it is safe to share.
// The 'no modules' case uses a brand-new student instead.

describe('Semester Results', () => {
  // Student who has graded modules.
  context('student with results', () => {
    beforeEach(() => {
      cy.loginAsDemoStudent();
      cy.get('[data-cy=nav-results]').click();
    });

    // Table headers required by the lab: Module Code, Module Title, Grade.
    it('shows Module Code, Title and Grade columns', () => {
      cy.get('[data-cy=results-table]').should('be.visible');
      cy.get('[data-cy=col-code]').should('contain', 'Module Code');
      cy.get('[data-cy=col-title]').should('contain', 'Module Title');
      cy.get('[data-cy=col-grade]').should('contain', 'Grade');
    });

    // Rows: every row has a code, title and grade, and SWE301 shows grade A.
    it('lists each registered module with its code, title and grade', () => {
      cy.get('[data-cy=result-row]').should('have.length.at.least', 1);
      cy.get('[data-cy=result-row]').first().within(() => {
        cy.get('[data-cy=result-code]').should('not.be.empty');
        cy.get('[data-cy=result-title]').should('not.be.empty');
        cy.get('[data-cy=result-grade]').should('not.be.empty');
      });
      cy.contains('[data-cy=result-code]', 'SWE301').parent()
        .find('[data-cy=result-grade]').should('contain', 'A');
    });

    // 'Download as PDF' calls window.print(); Cypress cannot drive the print dialog,
    // so window.print is replaced with a stub and we assert it was called once.
    it('the PDF download option opens the print dialog', () => {
      cy.window().then((win) => cy.stub(win, 'print').as('print'));
      cy.get('[data-cy=download-pdf]').should('be.visible').click();
      cy.get('@print').should('have.been.calledOnce');
    });
  });

  // INVALID: a student with no registered module must not see a results table.
  context('student who is not registered for any module', () => {
    it('does not show results and explains why', () => {
      cy.loginAsNewStudent();
      cy.get('[data-cy=nav-results]').click();
      cy.get('[data-cy=results-empty]').should('contain', 'No results yet');
      cy.get('[data-cy=results-table]').should('not.exist');
    });
  });
});
