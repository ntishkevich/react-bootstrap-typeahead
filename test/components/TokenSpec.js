import {mount} from 'enzyme';
import React from 'react';

import Token from '../../src/Token';

describe('<Token>', () => {
  let token;

  beforeEach(() => {
    token = mount(<Token>This is a token</Token>);
  });

  it('renders a basic token', () => {
    expect(token.find('div').hasClass('rbt-token')).toEqual(true);
    expect(token.text()).toEqual('This is a token');
  });

  it('renders a removeable token', () => {
    const onRemove = jest.fn();

    token.setProps({onRemove});

    const rootNode = token.find('.rbt-token');
    expect(rootNode.hasClass('rbt-token-removeable')).toEqual(true);

    const closeButton = token.find('button');
    closeButton.simulate('click');

    expect(closeButton.hasClass('rbt-token-remove-button')).toEqual(true);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
