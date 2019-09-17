import {mount} from 'enzyme';
import {head, noop} from 'lodash';
import React from 'react';

import TypeaheadInputMulti from '../../src/TypeaheadInputMulti';
import contextContainer from '../../src/containers/contextContainer';

import options from '../../example/exampleData';
import {context, getHint, getInput, getTokens} from '../helpers';

const TypeaheadInputMultiWithContext = contextContainer(TypeaheadInputMulti);

describe('<TypeaheadInputMulti>', () => {
  let text, wrapper;

  beforeEach(() => {
    text = 'text';
    wrapper = mount(
      <TypeaheadInputMultiWithContext
        {...context}
        inputProps={{}}
        inputRef={noop}
        labelKey="name"
        multiple
        onAdd={noop}
        onChange={noop}
        onFocus={noop}
        onKeyDown={noop}
        options={options}
        selected={options.slice(1, 4)}
        selectHintOnEnter={false}
        text={text}
      />
    );
  });

  it('renders a multi-select input', () => {
    const input = wrapper.find('.form-control');

    expect(input).toHaveLength(1);
    expect(input.hasClass('rbt-input')).toEqual(true);
    expect(input.hasClass('rbt-input-multi')).toEqual(true);
  });

  it('displays the selected text', () => {
    expect(getInput(wrapper).prop('value')).toEqual(text);
  });

  it('renders a multi-select input with tokens', () => {
    expect(getTokens(wrapper)).toHaveLength(3);
  });

  it('displays a hint', () => {
    const initialItem = head(options);

    wrapper.setProps({
      initialItem,
      isFocused: true,
      isMenuShown: true,
      text: 'Al',
    });

    expect(getHint(wrapper)).toEqual(initialItem.name);
  });

  it('renders with validation classnames', () => {
    wrapper.setProps({
      isInvalid: true,
      isValid: true,
    });

    const input = wrapper.find('.form-control');

    expect(input.hasClass('is-invalid')).toEqual(true);
    expect(input.hasClass('is-valid')).toEqual(true);
  });
});
