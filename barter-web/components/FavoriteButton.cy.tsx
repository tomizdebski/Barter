import React from 'react';
import { mount } from 'cypress/react';
import { FavoriteButton } from '../components/FavoriteButton';

describe('<FavoriteButton />', () => {
  const lessonId = 123;

  beforeEach(() => {
    // Czyścimy localStorage przed każdym testem
    localStorage.clear();
  });

  it('adds lesson to favorites on click', () => {
    mount(<FavoriteButton lessonId={lessonId} />);

    // Sprawdź, że serce nie jest wypełnione
    cy.get('svg').should('have.class', 'fill-transparent');

    // Kliknięcie w przycisk
    cy.get('div[data-tooltip-id]').click();

    // Serce powinno być wypełnione
    cy.get('svg').should('have.class', 'fill-[#00262b]');

    // Sprawdź localStorage
    cy.window().then((win) => {
      const stored = JSON.parse(win.localStorage.getItem('favorites') || '[]');
      expect(stored).to.include(lessonId);
    });
  });

  it('removes lesson from favorites on second click', () => {
    // Ręcznie dodajemy do localStorage przed montowaniem
    localStorage.setItem('favorites', JSON.stringify([lessonId]));

    mount(<FavoriteButton lessonId={lessonId} />);

    // Sprawdź, że serce jest wypełnione
    cy.get('svg').should('have.class', 'fill-[#00262b]');

    // Kliknij ponownie
    cy.get('div[data-tooltip-id]').click();

    // Serce powinno być puste
    cy.get('svg').should('have.class', 'fill-transparent');

    // Sprawdź, że zostało usunięte z localStorage
    cy.window().then((win) => {
      const stored = JSON.parse(win.localStorage.getItem('favorites') || '[]');
      expect(stored).to.not.include(lessonId);
    });
  });

  it('shows correct tooltip text', () => {
    mount(<FavoriteButton lessonId={lessonId} />);

    cy.get('div[data-tooltip-id]')
      .trigger('mouseover');

    cy.get(`#favorite-tooltip-${lessonId}`)
      .should('contain.text', 'Add to favourites');

    // Kliknij, by dodać
    cy.get('div[data-tooltip-id]').click();

    // Znowu najedź
    cy.get('div[data-tooltip-id]').trigger('mouseover');

    cy.get(`#favorite-tooltip-${lessonId}`)
      .should('contain.text', 'Remove from favourites');
  });
});
