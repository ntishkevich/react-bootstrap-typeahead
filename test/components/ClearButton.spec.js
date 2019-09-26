import React from 'react';
import {render, cleanup, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ClearButton from '../../src/ClearButton';

describe('<ClearButton>', () => {
  afterEach(cleanup);

  test('renders a default clear button', () => {
    const onClick = jest.fn();
    const {getByTestId} = render(
      <ClearButton onClick={onClick} data-testid="clear-button" />
    );

    const clearButton = getByTestId('clear-button');
    expect(clearButton.getAttribute('type')).toEqual('button');
    expect(clearButton).toHaveClass('close rbt-close');
  });

  test('renders a large clear button', () => {
    const onClick = jest.fn();
    const {getByTestId} = render(
      <ClearButton
        onClick={onClick}
        bsSize="large"
        data-testid="clear-button"
      />
    );

    const clearButton = getByTestId('clear-button');
    expect(clearButton).toHaveClass('rbt-close-lg');
  });

  test('registers a click', () => {
    const onClick = jest.fn();
    const {getByTestId} = render(
      <ClearButton onClick={onClick} data-testid="clear-button" />
    );

    const clearButton = getByTestId('clear-button');
    fireEvent.click(clearButton);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
