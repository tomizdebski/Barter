import React from 'react';
import { mount } from 'cypress/react';
import SearchBar from '../components/SearchBar';

describe('<SearchBar />', () => {
  it('submits search from desktop input', () => {
    const onSearch = cy.stub().as('onSearch');

    // Desktop viewport (>=800px)
    cy.viewport(1024, 768);

    mount(<SearchBar onSearch={onSearch} />);

    cy.get('form input[type="text"]').type('React{enter}');

    cy.get('@onSearch').should('have.been.calledWith', 'React');
  });

  it('opens mobile panel and submits search', () => {
    const onSearch = cy.stub().as('onSearch');

    // Mobile viewport (<800px)
    cy.viewport(375, 667);

    mount(<SearchBar onSearch={onSearch} />);

    // Kliknij ikonę lupy
    cy.get('button[aria-label="Open search"]').click();

    // Poczekaj na input w panelu mobilnym
    cy.get('div.fixed input[type="text"]')
      .should('be.visible')
      .type('Next.js');

    cy.contains('button', 'Search').click();

    cy.get('@onSearch').should('have.been.calledWith', 'Next.js');
  });

  it('closes mobile panel on cancel', () => {
    cy.viewport(375, 667);

    mount(<SearchBar onSearch={() => {}} />);

    cy.get('button[aria-label="Open search"]').click();

    cy.contains('button', 'Cancel').click();

    // Panel powinien zniknąć
    cy.get('div.fixed').should('not.exist');
  });

  it('does not call onSearch if query is empty', () => {
    const onSearch = cy.stub().as('onSearch');

    cy.viewport(1024, 768);

    mount(<SearchBar onSearch={onSearch} />);

    cy.get('form input[type="text"]').type('{enter}');

    cy.get('@onSearch').should('not.have.been.called');
  });
});

