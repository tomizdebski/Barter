import React from 'react';
import { mount } from 'cypress/react';
import AccountPage from '@/app/account/page';
import { UserContext, User } from '@/contexts/UserContext';

const mockUser: User = {
  id: 'abc123',
  email: 'tomasz@example.com',
  firstName: 'Tomasz',
  lastName: 'Izdebski',
  avatar: 'avatars/test.jpg',
};

describe('<AccountPage />', () => {
  it('shows loading when user is null', () => {
    const ctx = {
      user: null,
      setUser: cy.stub(),
      logout: cy.stub(),
    };

    mount(
      <UserContext.Provider value={ctx}>
        <AccountPage />
      </UserContext.Provider>
    );

    cy.contains('Loading...').should('be.visible');
  });

  it('renders user info when user is present', () => {
    const ctx = {
      user: mockUser,
      setUser: cy.stub(),
      logout: cy.stub(),
    };

    mount(
      <UserContext.Provider value={ctx}>
        <AccountPage />
      </UserContext.Provider>
    );

    cy.contains(`${mockUser.firstName}_${mockUser.id}`).should('be.visible');
    cy.contains(`${mockUser.firstName} ${mockUser.lastName}`).should('be.visible');
    cy.contains('Member since').should('be.visible');
    cy.get('img[alt="User avatar"]').should('exist');
    cy.contains('View My Records').should('be.visible');
    cy.contains("You don't have any barters yet.").should('be.visible');
  });
});
