import React from 'react';
import { mount } from 'cypress/react';
import RegisterPage from '@/app/auth/register/page';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

describe('<RegisterPage />', () => {
  let routerMock: any;

  beforeEach(() => {
    const push = cy.stub().as('push');

    routerMock = {
      push,
      replace: cy.stub(),
      prefetch: cy.stub().resolves(),
      back: cy.stub(),
      forward: cy.stub(),
      refresh: cy.stub(),
    };

    mount(
      <AppRouterContext.Provider value={routerMock}>
        <RegisterPage />
      </AppRouterContext.Provider>
    );
  });

  it('shows validation errors on empty submit', () => {
    cy.contains('Create an account').click();

    cy.contains('First name is required').should('be.visible');
    cy.contains('Last name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password must be at least 6 characters').should('be.visible');
    cy.contains('Avatar is required').should('be.visible');
  });

  it('accepts avatar and submits valid form', () => {
    // Wczytaj avatar z fixture
    cy.fixture('avatar.jpg', 'base64').then((fileContent) => {
        cy.get('input[type="file"]').selectFile({
            contents: Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg'),
            fileName: 'avatar.jpg',
        mimeType: 'image/jpeg',
        lastModified: Date.now(),
      });

      cy.contains('Accept avatar').click();
    });

    // Wypełnij dane
    cy.get('input[placeholder="First name"]').type('Tomasz');
    cy.get('input[placeholder="Last name"]').type('Izdebski');
    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');

    cy.intercept('POST', '**/auth/signup', {
      statusCode: 200,
      body: {},
    }).as('signup');

    cy.contains('Create an account').click();
    cy.wait('@signup');

    cy.get('@push').should('have.been.calledWith', '/auth/login');
  });
});
