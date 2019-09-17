import {shallow} from 'enzyme';
import React from 'react';

import ClearButton from '../../src/ClearButton';

describe('<ClearButton>', () => {
  let button, onClick;

  beforeEach(() => {
    onClick = jest.fn();
    button = shallow(<ClearButton onClick={onClick} />);
  });

  it('renders a default clear button', () => {
    expect(button.type()).toEqual('button');
    expect(button.hasClass('close rbt-close')).toEqual(true);
  });

  it('renders a large clear button', () => {
    button.setProps({bsSize: 'large'});
    expect(button.hasClass('rbt-close-lg')).toEqual(true);
  });

  it('registers a click', () => {
    button.simulate('click', {stopPropagation: () => {}});
    expect(onClick.calledOnce).toEqual(true);
  });
});
