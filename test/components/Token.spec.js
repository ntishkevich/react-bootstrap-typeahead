import React from 'react';
import {render, cleanup, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Token from '../../src/Token';

describe('<Token>', () => {
  afterEach(cleanup);

  test('renders a basic token', () => {
    const {container} = render(
      // todo wtf data-testid doesn't make any effect inside this case
      <Token className="token">This is a token</Token>
    );

    const token = container.querySelector('.token');
    expect(token).toBeDefined();
    expect(token).toHaveClass('rbt-token');
    expect(token).toHaveTextContent('This is a token');
  });

  test('renders a removeable token', () => {
    const onRemove = jest.fn();
    const {container, queryByTestId} = render(
      <Token
        onRemove={onRemove}
        data-testid="token">
        This is a token
      </Token>
    );

    const token = queryByTestId('token');
    expect(token).toBeDefined();
    expect(token).toHaveClass('rbt-token-removeable');

    const closeButton = container.querySelector('button[type="button"]');
    fireEvent.click(closeButton);

    expect(closeButton).toHaveClass('rbt-token-remove-button');
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
