import React from 'react';
import { mount } from 'cypress/react'; // lub 'cypress/react' jeśli masz React 17
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import LessonCard from '../components/LessonCard';

describe('<LessonCard />', () => {
  const defaultProps = {
    id: 1,
    name: 'Test Lesson',
    content: 'Lesson description',
    categoryName: 'Programming',
    instructorName: 'Jane Doe',
  };

  it('renders correctly and navigates on click', () => {
    const routerMock = {
      push: cy.stub().as('push'),
      replace: cy.stub(),
      prefetch: cy.stub(),
      back: cy.stub(),
      forward: cy.stub(),
      refresh: cy.stub(),
    };

    mount(
      <AppRouterContext.Provider value={routerMock}>
        <LessonCard {...defaultProps} />
      </AppRouterContext.Provider>
    );

    cy.contains('Test Lesson').should('be.visible');
    cy.contains('Lesson description').should('be.visible');
    cy.contains('Programming').should('be.visible');
    cy.contains('Jane Doe').should('be.visible');

    cy.get('div.cursor-pointer').first().click();

    cy.get('@push').should('have.been.calledWith', '/lessons/1');
  });

  it('renders fallback content when no photo provided', () => {
    const routerMock = {
      push: cy.stub(),
      replace: cy.stub(),
      prefetch: cy.stub(),
      back: cy.stub(),
      forward: cy.stub(),
      refresh: cy.stub(),
    };

    mount(
      <AppRouterContext.Provider value={routerMock}>
        <LessonCard {...defaultProps} photo={undefined} />
      </AppRouterContext.Provider>
    );

    cy.contains('No image').should('be.visible');
  });

  it('displays video indicator if video provided', () => {
    const routerMock = {
      push: cy.stub(),
      replace: cy.stub(),
      prefetch: cy.stub(),
      back: cy.stub(),
      forward: cy.stub(),
      refresh: cy.stub(),
    };

    mount(
      <AppRouterContext.Provider value={routerMock}>
        <LessonCard {...defaultProps} video="videos/example.mp4" />
      </AppRouterContext.Provider>
    );

    cy.contains('🎥 Video included').should('be.visible');
  });
});
