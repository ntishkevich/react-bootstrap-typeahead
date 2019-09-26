import React from 'react';
import {render, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Highlighter from '../../src/Highlighter';

describe('<Highlighter>', () => {
  afterEach(cleanup);

  test('renders a span containing a string', () => {
    const {queryByText} = render(
      <Highlighter search="">
        California
      </Highlighter>
    );

    const highlighter = queryByText('California');
    expect(highlighter).toBeDefined();
    expect(highlighter).toHaveTextContent('California');
    expect(highlighter.querySelectorAll('.rbt-highlight-text')).toHaveLength(0);
  });

  test('correctly highlights text', () => {
    const {container, queryAllByText} = render(
      <Highlighter search="a">
        California
      </Highlighter>
    );

    const allHighlighters = container.querySelectorAll('.rbt-highlight-text');
    expect(allHighlighters).toHaveLength(2);

    const allMatches = Array.from(queryAllByText('a'));
    expect(allMatches).toHaveLength(allHighlighters.length);
    allMatches.forEach((match) => {
      expect(match).toHaveTextContent('a');
    });
  });

  test('does not highlight text when there is no match', () => {
    const {container} = render(
      <Highlighter search="x">
        California
      </Highlighter>
    );

    expect(container.querySelectorAll('rbt-highlight-text')).toHaveLength(0);
  });

  test('is case-insensitive', () => {
    const {container, getByText} = render(
      <Highlighter search="cal">
        California
      </Highlighter>
    );

    const searchResult = getByText('Cal');
    expect(container.querySelectorAll('.rbt-highlight-text')).toHaveLength(1);
    expect(searchResult).toHaveTextContent('Cal');
  });

  test('ignores diacritical marks', () => {
    const {container, getByText} = render(
      <Highlighter search="krako">
        Kraków
      </Highlighter>
    );

    const searchResult = getByText('Krakó');
    expect(container.querySelectorAll('.rbt-highlight-text')).toHaveLength(1);
    expect(searchResult).toHaveTextContent('Krakó');
  });
});
