import React from 'react';
import { mount } from 'cypress/react';
import TrendingSection from '../components/TrendingSection';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Mockowane dane
const mockLessons = [
  {
    id: 1,
    name: 'Lesson A',
    content: 'Content A',
    photo: null,
    video: null,
    createdAt: '2024-01-01T12:00:00.000Z',
    category: { name: 'Programming' },
    instructor: { firstName: 'John', lastName: 'Doe' },
  },
  {
    id: 2,
    name: 'Lesson B',
    content: 'Content B',
    photo: null,
    video: null,
    createdAt: '2024-04-01T12:00:00.000Z',
    category: { name: 'Design' },
    instructor: { firstName: 'Anna', lastName: 'Nowak' },
  },
];

const mockCategories = [
  { name: 'Programming' },
  { name: 'Design' },
];

describe('<TrendingSection />', () => {
  beforeEach(() => {
    // Mock router (wymagany przez Next.js App Router)
    const routerMock = {
      push: cy.stub(),
      replace: cy.stub(),
      prefetch: cy.stub().resolves(),
      back: cy.stub(),
      forward: cy.stub(),
      refresh: cy.stub(),
    };

    // Intercepty
    cy.intercept('GET', 'http://localhost:4000/lessons', {
      statusCode: 200,
      body: mockLessons,
    }).as('getLessons');

    cy.intercept('GET', 'http://localhost:4000/categories', {
      statusCode: 200,
      body: mockCategories,
    }).as('getCategories');

    // Mount z kontekstem App Routera
    mount(
      <AppRouterContext.Provider value={routerMock}>
        <TrendingSection />
      </AppRouterContext.Provider>
    );

    cy.wait('@getLessons');
    cy.wait('@getCategories');
  });

  it('renders lesson cards and categories', () => {
    cy.contains('Trending on Barter').should('be.visible');
    cy.contains('Lesson A').should('be.visible');
    cy.contains('Lesson B').should('be.visible');
    cy.contains('Programming').should('be.visible');
    cy.contains('Design').should('be.visible');
  });

  it('filters lessons by selected category', () => {
    cy.contains('Programming').click();
    cy.contains('Lesson A').should('be.visible');
    cy.contains('Lesson B').should('not.exist');
  });

  it('toggles category filter off', () => {
    cy.contains('Programming').click(); // wybierz
    cy.contains('Lesson B').should('not.exist');
    cy.contains('Programming').click(); // odznacz
    cy.contains('Lesson A').should('be.visible');
    cy.contains('Lesson B').should('be.visible');
  });

  it('sorts lessons from newest to oldest', () => {
    // domyślnie: newest
    cy.get('section')
      .find('[data-testid="lesson-card"]')
      .first()
      .should('contain.text', 'Lesson B');

    cy.contains('From oldest').click();

    cy.get('section')
      .find('[data-testid="lesson-card"]')
      .first()
      .should('contain.text', 'Lesson A');
  });
});

