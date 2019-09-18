
import {mount} from 'enzyme';
import {head, noop} from 'lodash';
import React from 'react';

import TypeaheadInputSingle from '../../src/TypeaheadInputSingle';
import contextContainer from '../../src/containers/contextContainer';

import options from '../../example/exampleData';
import {context, getHint, getInput} from '../helpers';

const TypeaheadInputSingleWithContext = contextContainer(TypeaheadInputSingle);

describe('<TypeaheadInputSingle>', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <TypeaheadInputSingleWithContext
        {...context}
        inputProps={{}}
        inputRef={noop}
        labelKey="name"
        onAdd={noop}
        onChange={noop}
        onClear={noop}
        onFocus={noop}
        options={options}
        selected={[]}
        selectHintOnEnter={false}
        text=""
      />
    );
  });

  it('renders a single-select input', () => {
    const input = wrapper.find('.form-control');

    expect(input).toHaveLength(1);
    expect(input.hasClass('rbt-input')).toEqual(true);
    expect(input.hasClass('rbt-input-main')).toEqual(true);
  });

  it('displays the selected text', () => {
    const text = 'text';

    wrapper.setProps({text});

    expect(getInput(wrapper).prop('value')).toEqual(text);
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
