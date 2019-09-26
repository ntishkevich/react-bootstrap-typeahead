import React from 'react';
import {noop, pick} from 'lodash';
import {cleanup, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import MenuItem, {BaseMenuItem} from '../../src/MenuItem';
import contextContainer from '../../src/containers/contextContainer';
import {context} from '../helpers';

const MenuItemWithContext = contextContainer(MenuItem);

const event = {
  preventDefault: noop,
};
describe.skip('<BaseMenuItem> & <MenuItem>', () => {
  describe('<BaseMenuItem>', () => {
    let onClick;

    beforeEach(() => {
      onClick = jest.fn();
    });

    afterEach(cleanup);

    test('renders a base menu item', () => {
      const {container} = render(
        <BaseMenuItem>
          This is a base menu item.
        </BaseMenuItem>
      );

      expect(baseMenuItem).not.toBeUndefined();
      expect(baseMenuItem.type()).toEqual('li');
    });

    test('renders an active base menu item', () => {
      baseMenuItem.setProps({active: true});
      expect(baseMenuItem.hasClass('active')).toEqual(true);
    });

    test('triggers an event when clicked', () => {
      baseMenuItem.find('a').simulate('click', event);
      expect(onClick.calledOnce).toEqual(true);
    });

    test('renders a disabled base menu item', () => {
      baseMenuItem.setProps({disabled: true});
      baseMenuItem.find('a').simulate('click', event);

      expect(baseMenuItem.hasClass('disabled')).toEqual(true);
      expect(onClick.notCalled).toEqual(true);
    });
  });

  describe('<MenuItem>', () => {
    let menuItem, onClick;

    beforeEach(() => {
      const contextProps = pick(context, [
        'activeIndex',
        'isOnlyResult',
        'onActiveItemChange',
        'onInitialItemChange',
        'onMenuItemClick',
        'results',
      ]);

      onClick = jest.fn();
      menuItem = mount(
        <MenuItemWithContext
          {...contextProps}
          onClick={onClick}
          option={{label: 'test'}}
          position={0}>
          This is a menu item.
        </MenuItemWithContext>
      );
    });

    test('renders a menu item', () => {
      expect(menuItem).not.toBeUndefined();
      expect(menuItem.find('a')).toHaveLength(1);
    });

    test('changes the active state of the menu item', () => {
      expect(menuItem.hasClass('active')).toEqual(false);

      menuItem.setProps({activeIndex: 0});
      expect(menuItem.find('a').hasClass('active')).toEqual(true);
    });

    test('sets the active state if it is the only result', () => {
      expect(menuItem.hasClass('active')).toEqual(false);

      menuItem.setProps({
        highlightOnlyResult: true,
        results: ['test'],
      });
      expect(menuItem.find('a').hasClass('active')).toEqual(true);
    });

    test('triggers an event when clicked', () => {
      menuItem.find('a').simulate('click', event);
      expect(onClick.mock.calls).toBeTruthy();
    });
  });
});
