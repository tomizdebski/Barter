import React from 'react';
import { mount } from 'cypress/react';
import FavouritesDropdown from '../components/FavouritesDropdown';

const mockLesson = {
  id: 1,
  name: 'React Basics',
  photo: 'photos/react.png',
  category: { name: 'Programming' },
};

describe('<FavouritesDropdown />', () => {
  beforeEach(() => {
    localStorage.setItem('favorites', JSON.stringify([mockLesson.id]));

    cy.intercept(
      'GET',
      `**/lessons/by-ids?ids=${mockLesson.id}`,
      {
        statusCode: 200,
        body: [mockLesson],
      }
    ).as('getFavorites');

    mount(<FavouritesDropdown />);
  });

  it('opens dropdown and loads favorite lessons', () => {
    // Kliknij serduszko
    cy.get('button[aria-label="Toggle favorites dropdown"]').click();

    // Poczekaj na fetch
    cy.wait('@getFavorites');

    // Sprawdź, czy lekcja się pojawiła
    cy.contains('React Basics').should('be.visible');
    cy.contains('Programming').should('be.visible');
  });

  it('removes lesson from dropdown and localStorage', () => {
    // Otwórz dropdown
    cy.get('button[aria-label="Toggle favorites dropdown"]').click();
    cy.wait('@getFavorites');

    // Kliknij X obok lekcji
    cy.get('button[aria-label="Remove from favorites"]').click();

    // Powinna zniknąć
    cy.contains('React Basics').should('not.exist');

    // Sprawdź localStorage
    cy.window().then((win) => {
      const favorites = JSON.parse(win.localStorage.getItem('favorites') || '[]');
      expect(favorites).to.not.include(mockLesson.id);
    });
  });

  it('closes dropdown when clicking outside', () => {
    // Otwórz
    cy.get('button[aria-label="Toggle favorites dropdown"]').click();
    cy.wait('@getFavorites');

    // Kliknij poza dropdownem (body)
    cy.get('body').click(0, 0);

    // Dropdown powinien się zamknąć
    cy.contains('React Basics').should('not.exist');
  });
});
