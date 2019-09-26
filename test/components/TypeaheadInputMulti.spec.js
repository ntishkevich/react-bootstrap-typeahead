import React from 'react';
import {head, noop} from 'lodash';
import {cleanup, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import TypeaheadInputMulti from '../../src/TypeaheadInputMulti';
import contextContainer from '../../src/containers/contextContainer';

import options from '../../example/exampleData';
import {context} from '../helpers';

const TypeaheadInputMultiWithContext = contextContainer(TypeaheadInputMulti);

describe('<TypeaheadInputMulti>', () => {
  const text = 'text';

  afterEach(cleanup);

  test('renders a multi-select input', () => {
    const {container} = render(
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

    const typeahead = container.querySelector('.form-control');
    expect(typeahead).toBeDefined();
    expect(typeahead).toHaveClass('rbt-input');
    expect(typeahead).toHaveClass('rbt-input-multi');
  });

  test('displays the selected text', () => {
    const {queryByDisplayValue} = render(
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

    const input = queryByDisplayValue(text);
    expect(input).toBeDefined();
    expect(input).toHaveValue(text);
  });

  test('renders a multi-select input with tokens', () => {
    const {container} = render(
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

    const tokens = container.querySelectorAll('.rbt-token');
    expect(tokens).toHaveLength(3);
  });

  it('displays a hint', () => {
    const initialItem = head(options);

    const {queryByDisplayValue} = render(
      <TypeaheadInputMultiWithContext
        {...context}
        inputProps={{}}
        inputRef={noop}
        labelKey="name"
        initialItem={initialItem}
        isFocused
        isMenuShown
        text="Al"
        multiple
        onAdd={noop}
        onChange={noop}
        onFocus={noop}
        onKeyDown={noop}
        options={options}
        selected={options.slice(1, 4)}
        selectHintOnEnter={false}
      />
    );

    const hiddenInputWithHint = queryByDisplayValue(initialItem.name);
    expect(hiddenInputWithHint).toBeDefined();
    expect(hiddenInputWithHint).toHaveValue(initialItem.name);
  });

  test('renders with validation invalid classname', () => {
    const {container} = render(
      <TypeaheadInputMultiWithContext
        {...context}
        inputProps={{}}
        inputRef={noop}
        labelKey="name"
        isInvalid
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

    const typeahead = container.querySelector('.form-control');
    expect(typeahead).toBeDefined();
    expect(typeahead).toHaveClass('is-invalid');
  });

  test('renders with validation valid classname', () => {
    const {container} = render(
      <TypeaheadInputMultiWithContext
        {...context}
        inputProps={{}}
        inputRef={noop}
        labelKey="name"
        isValid
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

    const typeahead = container.querySelector('.form-control');
    expect(typeahead).toBeDefined();
    expect(typeahead).toHaveClass('is-valid');
  });
});
