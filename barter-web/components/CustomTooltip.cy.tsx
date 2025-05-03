import React from 'react';
import { mount } from 'cypress/react';
import { CustomTooltip } from '../components/CustomTooltip';

describe('<CustomTooltip />', () => {
  it('displays tooltip when hovered', () => {
    const tooltipId = 'test-tooltip';
    const tooltipText = 'Hello from tooltip!';

    mount(
      <div>
        <button data-tooltip-id={tooltipId} data-tooltip-content={tooltipText}>
          Hover me
        </button>
        <CustomTooltip id={tooltipId} content={tooltipText} />
      </div>
    );

    // Najedź na przycisk
    cy.contains('Hover me').trigger('mouseover');

    // Sprawdź, czy tooltip się pojawił
    cy.get(`#${tooltipId}`)
      .should('exist')
      .and('contain.text', tooltipText);
  });
});
