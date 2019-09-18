import {mount} from 'enzyme';
import React from 'react';

import MenuItem, {BaseMenuItem} from '../../src/MenuItem';
import TypeaheadMenu from '../../src/TypeaheadMenu';

import options from '../../example/exampleData';
import {getMenu, getPaginator} from '../helpers';

describe('<TypeaheadMenu>', () => {
  let menu;

  beforeEach(() => {
    menu = mount(
      <TypeaheadMenu
        id="menu-id"
        labelKey="name"
        options={options}
        text=""
      />
    );
  });

  it('renders a basic typeahead menu', () => {
    expect(menu.find('ul').hasClass('rbt-menu')).toEqual(true);
    expect(menu.find(MenuItem)).toHaveLength(options.length);
  });

  it('renders a menu with the specified max-height', () => {
    const getMaxHeight = (wrapper) => getMenu(wrapper).prop('style').maxHeight;

    menu.setProps({maxHeight: '200px'});
    expect(getMaxHeight(menu)).toEqual('200px');

    menu.setProps({maxHeight: '50%'});
    expect(getMaxHeight(menu)).toEqual('50%');
  });

  it('renders disabled menu items', () => {
    menu.setProps({options: options.map((o) => ({...o, disabled: true}))});
    expect(menu.find(MenuItem).first().prop('disabled')).toEqual(true);
  });

  it('renders an empty state when there are no results', () => {
    const emptyLabel = 'No matches found.';

    const menuItems = menu
      .setProps({emptyLabel, options: []})
      .find(BaseMenuItem);

    expect(menuItems).toHaveLength(1);
    expect(menuItems.first().text()).toEqual(emptyLabel);
  });

  describe('pagination behaviors', () => {
    let onPaginate, paginationLabel;

    beforeEach(() => {
      onPaginate = jest.fn();
      paginationLabel = 'More results...';
      menu.setProps({
        maxResults: 10,
        onPaginate,
        options: options.concat({
          name: paginationLabel,
          paginationOption: true,
        }),
      });
    });

    it('displays a paginator', () => {
      const paginatorNode = getPaginator(menu);
      expect(paginatorNode).toHaveLength(1);
      expect(paginatorNode.text()).toEqual(paginationLabel);
    });

    it('does not show a paginator when there are no results', () => {
      menu.setProps({options: []});
      expect(getPaginator(menu)).toHaveLength(0);
    });
  });
});
