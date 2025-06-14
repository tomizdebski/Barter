import React from 'react';
import { mount } from 'cypress/react';
import UserDropdown from '../components/UserDropdown';
import { UserContext, User } from '@/contexts/UserContext';

const mockUser: User = {
  id: '123',
  email: 'tomasz@example.com',
  firstName: 'Tomasz',
  lastName: 'Izdebski',
  avatar: 'avatars/test.jpg',
};

describe('<UserDropdown />', () => {
  beforeEach(() => {
    const mockContext = {
      user: mockUser,
      setUser: cy.stub(),
      logout: cy.stub().as('logout'),
    };

    mount(
      <UserContext.Provider value={mockContext}>
        <UserDropdown />
      </UserContext.Provider>
    );
  });

  it('renders avatar and toggles dropdown', () => {
    cy.get('img[alt="tomasz@example.com"]').should('be.visible');
    cy.get('button').click(); // otwórz dropdown
    cy.contains('Tomasz Izdebski').should('be.visible');
    cy.contains('tomasz@example.com').should('be.visible');
  });

  it('closes dropdown when clicking outside', () => {
    cy.get('button').click();
    cy.contains('tomasz@example.com').should('be.visible');
    cy.get('body').click(0, 0); // klik poza
    cy.contains('tomasz@example.com').should('not.exist');
  });

  it('renders expected navigation links', () => {
    cy.get('button').click();
    cy.contains('Dashboard').should('have.attr', 'href', '/dashboard');
    cy.contains('Account').should('have.attr', 'href', '/account');
    cy.contains('Add Lesson').should('have.attr', 'href', '/lessons/create');
    cy.contains('My Favourites').should('have.attr', 'href', '/my-favourites');
  });

  it('calls logout on Sign Out click', () => {
    cy.get('button').click();
    cy.contains('Sign Out').click();
    cy.get('@logout').should('have.been.called');
  });
});
