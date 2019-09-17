import React from 'react';
import {mount} from 'enzyme';

import {AsyncTypeahead} from '../../src';
import {change, focus, getMenuItems, keyDown} from '../helpers';
import {DOWN, RETURN} from '../../src/constants';

function search(wrapper, query, callback) {
  change(wrapper, query);
  wrapper.setProps({isLoading: true});

  setTimeout(() => {
    wrapper.setProps({isLoading: false});
    callback();
  }, 0);
}

describe('<AsyncTypeahead>', () => {
  let onSearch, wrapper;

  beforeEach(() => {
    onSearch = jest.fn();
    wrapper = mount(
      <AsyncTypeahead
        delay={0}
        isLoading={false}
        minLength={0}
        onSearch={onSearch}
      />
    );
  });

  it('displays a prompt', () => {
    throw new Error();
    const promptText = 'Prompt text';

    wrapper.setProps({promptText});

    focus(wrapper);
    const menuItems = getMenuItems(wrapper);

    expect(menuItems).toHaveLength(1);
    expect(menuItems.text()).toEqual(promptText);
  });

  it('displays the search text while searching', (done) => {
    const searchText = 'Search text';

    onSearch = () => {
      wrapper.setProps({isLoading: true});

      const menuItems = getMenuItems(wrapper);
      expect(menuItems).toHaveLength(1);
      expect(menuItems.text()).toEqual(searchText);
      done();
    };

    wrapper.setProps({
      onSearch,
      searchText,
    });

    change(wrapper, 'search');
  });

  it('displays the empty label when there are no results', (done) => {
    const emptyLabel = 'empty label';

    wrapper.setProps({
      emptyLabel,
      useCache: false,
    });

    search(wrapper, 'search', () => {
      const menuItems = getMenuItems(wrapper);
      expect(menuItems).toHaveLength(1);
      expect(menuItems.text()).toEqual(emptyLabel);
      done();
    });
  });

  it('displays the empty label when the input has an initial value', () => {
    const emptyLabel = 'empty label';

    wrapper = mount(
      <AsyncTypeahead
        defaultInputValue="sometext"
        delay={0}
        emptyLabel={emptyLabel}
        isLoading={false}
        minLength={0}
        onSearch={onSearch}
        useCache={false}
      />
    );

    focus(wrapper);
    const menuItems = getMenuItems(wrapper);

    expect(menuItems).toHaveLength(1);
    expect(menuItems.text()).toEqual(emptyLabel);
  });

  it('delays the search by at least the specified amount', (done) => {
    const delay = 100;
    const preSearch = Date.now();

    onSearch = () => {
      expect(Date.now() - preSearch).toBeGreaterThanOrEqual(delay);
      done();
    };

    // Re-mount since delay is applied in `componentDidMount`.
    wrapper = mount(
      <AsyncTypeahead
        delay={delay}
        isLoading={false}
        onSearch={onSearch}
      />
    );

    // Perform search.
    change(wrapper, 'search');
  });

  it('does not call onSearch when a selection is made', () => {
    const onChange = jest.fn();

    wrapper.setProps({
      onChange,
      options: ['one', 'two', 'four'],
    });

    focus(wrapper);
    keyDown(wrapper, DOWN);
    keyDown(wrapper, RETURN);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledTimes(0);
  });

  it('uses cached results and does not perform a new search', (done) => {
    let menuItems;
    let callCount = 0;

    onSearch = (options, callback) => (query) => {
      callCount += 1;

      wrapper.setProps({isLoading: true});

      setTimeout(() => {
        wrapper.setProps({
          isLoading: false,
          options,
        });
        callback();
      }, 0);
    };

    wrapper.setProps({
      onSearch: onSearch(['test-one', 'test-two', 'test-three'], () => {
        focus(wrapper);
        menuItems = getMenuItems(wrapper);
        expect(menuItems).toHaveLength(3);
        expect(callCount).toEqual(1);

        wrapper.setProps({
          onSearch: onSearch([], () => {
            focus(wrapper);
            menuItems = getMenuItems(wrapper);
            expect(menuItems).toHaveLength(1);
            expect(menuItems.text()).toEqual('No matches found.');
            expect(callCount).toEqual(2);

            // Repeat first search
            change(wrapper, 'test');
            setTimeout(() => {
              focus(wrapper);
              menuItems = getMenuItems(wrapper);
              expect(menuItems).toHaveLength(3);
              expect(callCount).toEqual(2);
              done();
            }, 0);
          }),
        });

        // Second search
        change(wrapper, 'test!');
      }),
    });

    // First search
    change(wrapper, 'test');
  });

  it('does not use cached results', (done) => {
    wrapper.setProps({
      useCache: false,
    });

    // Initial search
    search(wrapper, 'search', () => {
      expect(onSearch).toHaveBeenCalledTimes(1);

      // Perform the search again.
      search(wrapper, 'search', () => {
        expect(onSearch).toHaveBeenCalledTimes(2);
        done();
      });
    });
  });

  it('performs a search when there is already a selection', (done) => {
    wrapper.setProps({
      multiple: true,
      onChange: () => {},
      options: ['one', 'two'],
      selected: ['one'],
    });

    expect(onSearch).toHaveBeenCalledTimes(0);

    search(wrapper, 'two', () => {
      expect(onSearch).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('receives an event as the second argument of `onInputChange`', () => {
    wrapper.setProps({
      onInputChange: (text, e) => {
        expect(text).toEqual('x');
        expect(e).not.toBeUndefined();
      },
    });

    change(wrapper, 'x');
  });

  it('adds a custom option when exact match is found ' +
      'and `allowNew` returns true', (done) => {
    const emptyLabel = 'No results...';
    const newSelectionPrefix = 'New selection: ';
    const text = 'zzz';

    wrapper.setProps({
      allowNew: () => true,
      emptyLabel,
      isLoading: true,
      newSelectionPrefix,
      useCache: false,
    });

    focus(wrapper);

    search(wrapper, text, () => {
      wrapper.setProps({
        options: [text],
      });

      focus(wrapper);
      const menuItems = getMenuItems(wrapper);

      expect(menuItems).toHaveLength(2);
      expect(menuItems.at(0).text()).toEqual(text);
      expect(menuItems.at(1).text()).toEqual(`${newSelectionPrefix}${text}`);
      done();
    });
  });

  it('makes the typeahead instance and public methods available', () => {
    const instance = wrapper.instance().getInstance();

    expect(instance.clear).toBeInstanceOf(Function);
    expect(typeof instance.blur).toEqual('function');
    expect(typeof instance.focus).toEqual('function');
    expect(typeof instance.getInput).toEqual('function');
  });
});
