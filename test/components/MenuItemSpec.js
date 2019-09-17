import {mount, shallow} from 'enzyme';
import {noop, pick} from 'lodash';
import React from 'react';

import MenuItem, {BaseMenuItem} from '../../src/MenuItem';
import contextContainer from '../../src/containers/contextContainer';
import {context} from '../helpers';

const MenuItemWithContext = contextContainer(MenuItem);

const event = {
  preventDefault: noop,
};

describe('<BaseMenuItem>', () => {
  let baseMenuItem, onClick;

  beforeEach(() => {
    onClick = jest.fn();
    baseMenuItem = shallow(
      <BaseMenuItem onClick={onClick}>
        This is a base menu item.
      </BaseMenuItem>
    );
  });

  it('renders a base menu item', () => {
    expect(baseMenuItem).not.toBeUndefined();
    expect(baseMenuItem.type()).toEqual('li');
  });

  it('renders an active base menu item', () => {
    baseMenuItem.setProps({active: true});
    expect(baseMenuItem.hasClass('active')).toEqual(true);
  });

  it('triggers an event when clicked', () => {
    baseMenuItem.find('a').simulate('click', event);
    expect(onClick.calledOnce).toEqual(true);
  });

  it('renders a disabled base menu item', () => {
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

  it('renders a menu item', () => {
    expect(menuItem).not.toBeUndefined();
    expect(menuItem.find('a')).toHaveLength(1);
  });

  it('changes the active state of the menu item', () => {
    expect(menuItem.hasClass('active')).toEqual(false);

    menuItem.setProps({activeIndex: 0});
    expect(menuItem.find('a').hasClass('active')).toEqual(true);
  });

  it('sets the active state if it is the only result', () => {
    expect(menuItem.hasClass('active')).toEqual(false);

    menuItem.setProps({
      highlightOnlyResult: true,
      results: ['test'],
    });
    expect(menuItem.find('a').hasClass('active')).toEqual(true);
  });

  it('triggers an event when clicked', () => {
    menuItem.find('a').simulate('click', event);
    expect(onClick.mock.calls).toBeTruthy();
  });
});
