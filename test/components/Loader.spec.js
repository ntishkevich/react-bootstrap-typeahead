
import {shallow} from 'enzyme';
import React from 'react';

import Loader from '../../src/Loader';

describe('<Loader>', () => {
  let loader;

  beforeEach(() => {
    loader = shallow(<Loader />);
  });

  it('renders a default loading indicator', () => {
    expect(loader.type()).toEqual('div');
    expect(loader.hasClass('rbt-loader')).toEqual(true);
  });

  it('renders a small loading indicator', () => {
    loader.setProps({bsSize: 'small'});
    expect(loader.hasClass('rbt-loader-sm')).toEqual(true);
  });

  it('renders a large loading indicator', () => {
    loader.setProps({bsSize: 'large'});
    expect(loader.hasClass('rbt-loader-lg')).toEqual(true);
  });
});
