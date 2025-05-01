import React from 'react';
import { mount } from 'cypress/react';
import AskForm from '../components/AskForm';

describe('<AskForm />', () => {
  const lessonId = 42;
  const instructorEmail = 'instructor@example.com';

  it('sends message and shows success', () => {
    const onSent = cy.stub().as('onSent');

    // Interceptowanie fetch
    cy.intercept('POST', `${Cypress.env('NEXT_PUBLIC_API_URL')}/messages`, {
      statusCode: 200,
    }).as('sendMessage');

    mount(
      <AskForm lessonId={lessonId} instructorEmail={instructorEmail} onSent={onSent} />
    );

    // Wpisz wiadomość
    const message = 'Hello! Can I join your lesson?';
    cy.get('textarea').type(message).should('have.value', message);

    // Kliknij przycisk "Send"
    cy.contains('Send').click();

    // Powinno pojawić się „Sending...”
    cy.contains('Sending...').should('exist');

    // Poczekaj na fetch
    cy.wait('@sendMessage');

    // onSent powinien zostać wywołany
    cy.get('@onSent').should('have.been.calledOnce');

    // Status powinien się zmienić z powrotem na "Send"
    cy.contains('Send').should('exist');
  });

  it('shows error message on failed send', () => {
    const onSent = cy.stub();

    cy.intercept('POST', `${Cypress.env('NEXT_PUBLIC_API_URL')}/messages`, {
      statusCode: 500,
    }).as('sendMessage');

    mount(
      <AskForm lessonId={lessonId} instructorEmail={instructorEmail} onSent={onSent} />
    );

    cy.get('textarea').type('Test failure');
    cy.contains('Send').click();

    cy.wait('@sendMessage');
    cy.contains('Something went wrong.').should('be.visible');
    cy.get('@sendMessage.all').its('length').should('eq', 1);
    cy.wrap(onSent).should('not.have.been.called');
  });
});
