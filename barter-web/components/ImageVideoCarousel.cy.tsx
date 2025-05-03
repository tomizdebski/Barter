import React from 'react';
import { mount } from 'cypress/react';
import ImageVideoCarousel from '../components/ImageVideoCarousel';

describe('<ImageVideoCarousel />', () => {
  const props = {
    photo: 'images/sample.jpg',
    video: 'videos/sample.mp4',
    title: 'Sample Lesson',
  };

  beforeEach(() => {
    mount(<ImageVideoCarousel {...props} />);
  });

  it('renders the image first by default', () => {
    cy.get('img')
      .should('have.attr', 'src')
      .and('include', props.photo);
  });

  it('switches to video on next arrow click', () => {
    cy.get('button[aria-label="Next"]').click();

    cy.get('video')
      .should('have.attr', 'src')
      .and('include', props.video);
  });

  it('goes back to image on previous arrow click', () => {
    cy.get('button[aria-label="Next"]').click();
    cy.get('button[aria-label="Previous"]').click();

    cy.get('img')
      .should('have.attr', 'src')
      .and('include', props.photo);
  });

  it('loops forward and backward', () => {
    cy.get('button[aria-label="Previous"]').click({ force: true }); // should show video
    cy.get('video').should('exist');

    cy.get('button[aria-label="Next"]').click({ force: true }); // should go back to image
    cy.get('img').should('exist');
  });
});
