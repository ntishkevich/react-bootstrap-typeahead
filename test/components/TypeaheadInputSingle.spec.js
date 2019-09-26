import React from 'react';
import {head, noop} from 'lodash';
import {cleanup, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import TypeaheadInputSingle from '../../src/TypeaheadInputSingle';
import contextContainer from '../../src/containers/contextContainer';

import options from '../../example/exampleData';
import {context} from '../helpers';

const TypeaheadInputSingleWithContext = contextContainer(TypeaheadInputSingle);

describe('<TypeaheadInputSingle>', () => {
  afterEach(cleanup);

  test('renders a single-select input', () => {
    const {container} = render(
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

    const typeahead = container.querySelector('.form-control');
    expect(typeahead).toBeDefined();
    expect(typeahead).toHaveClass('rbt-input');
    expect(typeahead).toHaveClass('rbt-input-main');
  });

  test('displays the selected text', () => {
    const text = 'text';

    const {queryByDisplayValue} = render(
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
        text={text}
      />
    );

    const input = queryByDisplayValue(text);
    expect(input).toBeDefined();
    expect(input).toHaveValue(text);
  });

  test('displays a hint', () => {
    const initialItem = head(options);

    const {queryByDisplayValue} = render(
      <TypeaheadInputSingleWithContext
        {...context}
        inputProps={{}}
        inputRef={noop}
        initialItem={initialItem}
        isFocused
        isMenuShown
        labelKey="name"
        onAdd={noop}
        onChange={noop}
        onClear={noop}
        onFocus={noop}
        options={options}
        selected={[]}
        selectHintOnEnter={false}
        text="Al"
      />
    );

    const hiddenInputWithHint = queryByDisplayValue(initialItem.name);
    expect(hiddenInputWithHint).toBeDefined();
    expect(hiddenInputWithHint).toHaveValue(initialItem.name);
  });

  test('renders with validation invalid classname', () => {
    const {container} = render(
      <TypeaheadInputSingleWithContext
        {...context}
        inputProps={{}}
        inputRef={noop}
        isInvalid
        labelKey="name"
        onAdd={noop}
        onChange={noop}
        onClear={noop}
        onFocus={noop}
        options={options}
        selected={[]}
        selectHintOnEnter={false}
        text="Al"
      />
    );

    const typeahead = container.querySelector('.form-control');
    expect(typeahead).toBeDefined();
    expect(typeahead).toHaveClass('is-invalid');
  });

  test('renders with validation valid classname', () => {
    const {container} = render(
      <TypeaheadInputSingleWithContext
        {...context}
        inputProps={{}}
        inputRef={noop}
        isValid
        labelKey="name"
        onAdd={noop}
        onChange={noop}
        onClear={noop}
        onFocus={noop}
        options={options}
        selected={[]}
        selectHintOnEnter={false}
        text="Al"
      />
    );

    const typeahead = container.querySelector('.form-control');
    expect(typeahead).toBeDefined();
    expect(typeahead).toHaveClass('is-valid');
  });
});
