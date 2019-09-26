import React from 'react';
import {render, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Loader from '../../src/Loader';

describe('<Loader>', () => {
  afterEach(cleanup);

  test('renders a default loading indicator', () => {
    const {container} = render(<Loader />);

    const loaderElement = container.firstElementChild;
    expect(loaderElement).toHaveClass('rbt-loader');
  });

  test('renders a small loading indicator', () => {
    const {container} = render(<Loader bsSize="small" />);

    const loaderElement = container.firstElementChild;
    expect(loaderElement).toHaveClass('rbt-loader-sm');
  });

  test('renders a large loading indicator', () => {
    const {container} = render(<Loader bsSize="large" data-testid="loader" />);

    const loaderElement = container.firstElementChild;
    expect(loaderElement).toHaveClass('rbt-loader-lg');
  });
});
