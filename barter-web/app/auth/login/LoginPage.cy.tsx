import React from 'react';
import { mount } from 'cypress/react';
import LoginPage from '@/app/auth/login/page';
import { UserContext, User } from '@/contexts/UserContext';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

describe('<LoginPage />', () => {
  let mockSetUser: any;
  let mockPush: any;
  let routerMock: any;
  let userContextMock: any;

  beforeEach(() => {
    // Przenieś stuby tutaj
    mockSetUser = cy.stub().as('setUser');
    mockPush = cy.stub().as('push');

    routerMock = {
      push: mockPush,
      replace: cy.stub(),
      prefetch: cy.stub().resolves(),
      back: cy.stub(),
      forward: cy.stub(),
      refresh: cy.stub(),
    };

    userContextMock = {
      user: null,
      setUser: mockSetUser,
      logout: cy.stub(),
    };

    cy.clearCookies();

    mount(
      <AppRouterContext.Provider value={routerMock}>
        <UserContext.Provider value={userContextMock}>
          <LoginPage />
        </UserContext.Provider>
      </AppRouterContext.Provider>
    );
  });

  it('shows validation errors on empty submit', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('submits valid data and sets user', () => {
    cy.setCookie(
      'token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidGVzdEBiYXJ0ZXIuY29tIiwiZmlyc3ROYW1lIjoiVG9tYXN6IiwibGFzdE5hbWUiOiJJemRlYnNraSIsImF2YXRhclVybCI6ImF2YXRhcnMvdGVzdC5qcGciLCJpYXQiOjE2OTYyMDY0MDAsImV4cCI6MTY5NjI5MjgwMH0.ZYu9vMdcyCn6J5YZUGMOTt2vMBPjzZB7le_WADCeSMs'
    );

    cy.intercept('POST', '**/auth/signin', {
      statusCode: 200,
      body: {},
    }).as('signin');

    cy.get('input[placeholder="Email"]').type('test@barter.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@signin');
    cy.get('@setUser').should('have.been.called');
    cy.get('@push').should('have.been.calledWith', '/');
  });

  it('shows server error on failed login', () => {
    cy.intercept('POST', '**/auth/signin', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('signin');

    cy.get('input[placeholder="Email"]').type('test@barter.com');
    cy.get('input[placeholder="Password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    cy.wait('@signin');
    cy.contains('Invalid credentials').should('be.visible');
  });
});
