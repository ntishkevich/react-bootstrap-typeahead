
import {shallow} from 'enzyme';
import React from 'react';

import Highlighter from '../../src/Highlighter';

describe('<Highlighter>', () => {
  let highlighter, matches;

  beforeEach(() => {
    highlighter = shallow(
      <Highlighter search="">
        California
      </Highlighter>
    );
  });

  it('renders a span containing a string', () => {
    expect(highlighter.type()).toEqual('span');
    expect(highlighter.text()).toEqual('California');
    expect(highlighter.find('mark')).toHaveLength(0);
  });

  it('correctly highlights text', () => {
    matches = highlighter
      .setProps({search: 'a'})
      .find('mark');

    expect(matches).toHaveLength(2);
    expect(matches.first().text()).toEqual('a');
  });

  it('does not highlight text when there is no match', () => {
    highlighter.setProps({search: 'x'});
    expect(highlighter.find('mark')).toHaveLength(0);
  });

  it('is case-insensitive', () => {
    matches = highlighter
      .setProps({search: 'cal'})
      .find('mark');

    expect(matches).toHaveLength(1);
    expect(matches.first().text()).toEqual('Cal');
  });

  it('ignores diacritical marks', () => {
    matches = highlighter
      .setProps({
        children: 'Kraków',
        search: 'krako',
      })
      .find('mark');

    expect(matches).toHaveLength(1);
    expect(matches.first().text()).toEqual('Krakó');
  });
});
