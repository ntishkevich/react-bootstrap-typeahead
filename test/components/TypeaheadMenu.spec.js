import React from 'react';
import {render, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import TypeaheadMenu from '../../src/TypeaheadMenu';

import options from '../../example/exampleData';

describe('<TypeaheadMenu>', () => {
  afterEach(cleanup);

  test('renders a basic typeahead menu', () => {
    const {getByRole} = render(
      <TypeaheadMenu
        id="menu-id"
        labelKey="name"
        options={options}
        text=""
      />
    );

    const menu = getByRole('listbox');
    expect(menu).toHaveClass('rbt-menu');
    expect(menu.children).toHaveLength(options.length);
  });

  test('renders a menu with the specified max-height', () => {
    const style = {
      maxHeight: '200px',
    };

    const {getByRole, rerender} = render(
      <TypeaheadMenu
        id="menu-id"
        style={style}
        labelKey="name"
        options={options}
        text=""
      />
    );

    expect(getByRole('listbox')).toHaveStyle(`maxHeight: ${style.maxHeight}`);

    style.maxHeight = '50%';
    rerender(
      <TypeaheadMenu
        style={style}
        id="menu-id"
        labelKey="name"
        options={options}
        text=""
      />
    );

    expect(getByRole('listbox')).toHaveStyle(`maxHeight: ${style.maxHeight}`);
  });

  test('renders disabled menu items', () => {
    const disabledOptions = options.map((o) => ({...o, disabled: true}));
    const {getByRole} = render(
      <TypeaheadMenu
        id="menu-id"
        labelKey="name"
        text=""
        options={disabledOptions}
      />
    );

    const menu = getByRole('listbox');
    const menuItems = Array.from(menu.children);

    menuItems.forEach((menuItem) => {
      expect(menuItem).toHaveClass('disabled');
    });
  });

  test('renders an empty state when there are no results', () => {
    const emptyLabel = 'No matches found.';
    const {getByRole, getByText} = render(
      <TypeaheadMenu
        emptyLabel={emptyLabel}
        id="menu-id"
        labelKey="name"
        options={[]}
        text=""
      />
    );

    expect(getByRole('listbox').children).toHaveLength(1);
    expect(getByText(emptyLabel)).toHaveTextContent(emptyLabel);
  });

  describe('pagination behaviors', () => {
    const paginationLabel = 'More results...';
    const newOptions = options.concat({
      name: paginationLabel,
      paginationOption: true,
    });
    let onPaginate;
    let wrapper;

    beforeEach(() => {
      onPaginate = jest.fn();

      wrapper = render(
        <TypeaheadMenu
          id="menu-id"
          labelKey="name"
          options={newOptions}
          onPaginate={onPaginate}
          maxResults={10}
          text=""
        />
      );
    });

    afterEach(cleanup);

    test('displays a paginator', () => {
      const paginatorNode = wrapper.queryByText(paginationLabel);
      expect(paginatorNode).toBeDefined();
      expect(paginatorNode).toHaveTextContent(paginationLabel);
    });

    test('does not show a paginator when there are no results', () => {
      wrapper.rerender(
        <TypeaheadMenu
          id="menu-id"
          labelKey="name"
          options={[]}
          onPaginate={onPaginate}
          maxResults={10}
          text=""
        />
      );

      const menu = wrapper.getByRole('listbox');
      const menuItems = Array.from(menu.children);
      menuItems.forEach((menuItem) => {
        expect(menuItem).toHaveClass('disabled');
      });
    });
  });
});
