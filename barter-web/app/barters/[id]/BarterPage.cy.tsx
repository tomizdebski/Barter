import { BarterPage } from './BarterPage'; // dopasuj ścieżkę
import { mount } from 'cypress/react'; // jeśli używasz Next.js: 'cypress/next'

describe('BarterPage (component test)', () => {
  const barterId = 1;
  const apiUrl = `http://localhost:4000/barters/${barterId}`;

  it('displays loading state initially', () => {
    cy.intercept('GET', apiUrl, {
      delay: 1000,
      body: {},
    }).as('getBarter');

    mount(<BarterPage barterId={barterId} />);
    cy.contains('Loading...').should('be.visible');
  });

  it('displays error when fetch fails', () => {
    cy.intercept('GET', apiUrl, {
      statusCode: 404,
      body: {},
    }).as('getBarterFail');

    mount(<BarterPage barterId={barterId} />);
    cy.contains('Error loading barter.').should('be.visible');
  });

  it('renders barter content on success', () => {
    cy.intercept('GET', apiUrl, {
      statusCode: 200,
      body: {
        id: barterId,
        message: 'Interested in exchange?',
        lesson: {
          id: 1,
          name: 'Guitar for Beginners',
          content: 'Learn basic guitar chords and songs.',
          photo: '',
          video: '',
          instructor: { firstName: 'John', lastName: 'Doe' },
          category: { name: 'Music' },
          localization: { name: 'Warsaw' },
        },
        offeredLesson: {
          id: 2,
          name: 'English Tutoring',
          content: 'Conversational English lessons.',
          photo: '',
          video: '',
          instructor: { firstName: 'Anna', lastName: 'Smith' },
          category: { name: 'Languages' },
          localization: { name: 'Online' },
        },
      },
    }).as('getBarterSuccess');

    mount(<BarterPage barterId={barterId} />);

    cy.contains('Guitar for Beginners').should('be.visible');
    cy.contains('English Tutoring').should('be.visible');
    cy.contains('John Doe').should('be.visible');
    cy.contains('Anna Smith').should('be.visible');
    cy.contains('Warsaw').should('be.visible');
    cy.contains('Online').should('be.visible');
  });
});
