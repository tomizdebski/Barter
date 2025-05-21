import Dashboard from './Dashboard'; 
import { mount } from 'cypress/react';
import React from 'react';
import { UserContext } from '@/contexts/UserContext';
import * as nextRouter from 'next/navigation';

describe('Dashboard component', () => {
  beforeEach(() => {
    // Mock Router
    cy.stub(nextRouter, 'useRouter').returns({
      push: cy.stub().as('routerPush'),
      prefetch: cy.stub(),
    });

    // API intercepty
    cy.intercept('GET', '**/users/1/activities', { statusCode: 200, body: [ { type: 'LESSON_CREATED', description: 'You created a new lesson', date: new Date().toISOString(), } ] }).as('getActivities');

    cy.intercept('GET', '**/lessons/my', { statusCode: 200, body: [ { id: 1, name: 'React Basics' }, { id: 2, name: 'Guitar' }, ] }).as('getLessons');

    cy.intercept('GET', '**/barters/sent', { statusCode: 200, body: [ { id: 123, status: 'PENDING', lesson: { id: 1, name: 'React Basics' }, offeredLesson: { id: 2, name: 'Guitar' }, } ] }).as('getBarters');
  });

  it('renders dashboard with welcome message and fetches data', () => {
    const user = { id: '1', firstName: 'Tomasz', email: 'tomasz@example.com' };

    const mockContextValue = { user, setUser: () => {}, logout: () => {} };

    mount(
      <UserContext.Provider value={mockContextValue}>
        <Dashboard />
      </UserContext.Provider>
    );

    cy.contains('Welcome , Tomasz!').should('be.visible');
    cy.wait(['@getActivities', '@getLessons', '@getBarters']);
  });
});

