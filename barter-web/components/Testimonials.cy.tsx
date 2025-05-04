import React from 'react';
import { mount } from 'cypress/react';
import Testimonials from '../components/Testimonials';

describe('<TestimonialsBarter />', () => {
  beforeEach(() => {
    mount(<Testimonials />);
  });

  it('renders section headings', () => {
    cy.contains('Feedback from our users').should('be.visible');
    cy.contains('What Barter users are saying').should('be.visible');
  });

  it('renders exactly 3 testimonials', () => {
    cy.get('[data-testid="testimonial-card"]').should('have.length', 3);
  });

  it('renders content of specific testimonial', () => {
    cy.get('[data-testid="testimonial-card"]').contains('Anna K.').should('be.visible');
    cy.get('[data-testid="testimonial-card"]').contains('Frontend Developer, Kraków').should('be.visible');

    cy.get('[data-testid="testimonial-card"]').contains('Eliza P.').should('be.visible');
    cy.get('[data-testid="testimonial-card"]').contains('Junior JS Developer, Poznań').should('be.visible');
  });

  it('renders 💬 avatar icon in each testimonial', () => {
    cy.get('[data-testid="testimonial-card"]').each(($card) => {
      cy.wrap($card).find('span').contains('💬').should('exist');
    });
  });
});
