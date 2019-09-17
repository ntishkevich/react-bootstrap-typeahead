
import {shallow} from 'enzyme';
import React from 'react';

import Menu from '../../src/Menu.react';
import MenuItem, {BaseMenuItem} from '../../src/MenuItem';

describe('<Menu>', () => {
  let menu;

  beforeEach(() => {
    const options = [
      {label: 'Item 1'},
      {label: 'Item 2'},
      {label: 'Item 3'},
    ];

    menu = shallow(
      <Menu id="menu-id" paginate={false}>
        {options.map((o, idx) => (
          <MenuItem
            key={o.label}
            option={o}
            position={idx}>
            {o.label}
          </MenuItem>
        ))}
      </Menu>
    );
  });

  it('renders a basic menu with menu items', () => {
    expect(menu.hasClass('rbt-menu dropdown-menu')).toEqual(true);
    expect(menu.children()).toHaveLength(3);
  });

  it('sets the maxHeight and other styles', () => {
    let maxHeight = '100px';

    function getAttribute(wrapper, attribute) {
      return wrapper.prop('style')[attribute];
    }

    menu.setProps({
      maxHeight,
      style: {backgroundColor: 'red'},
    });

    expect(getAttribute(menu, 'backgroundColor')).toEqual('red');
    expect(getAttribute(menu, 'maxHeight')).toEqual(maxHeight);

    maxHeight = '75%';
    menu.setProps({maxHeight});
    expect(getAttribute(menu, 'maxHeight')).toEqual(maxHeight);
  });

  it('renders an empty label when there are no children', () => {
    const emptyLabel = 'No matches.';
    menu.setProps({
      children: undefined,
      emptyLabel,
    });

    expect(menu.children()).toHaveLength(1);

    const emptyLabelItem = menu.find(BaseMenuItem);
    expect(emptyLabelItem).toHaveLength(1);
    expect(emptyLabelItem.prop('disabled')).toEqual(true);

    // See: http://airbnb.io/enzyme/docs/api/ShallowWrapper/dive.html
    expect(emptyLabelItem.dive().text()).toEqual(emptyLabel);
  });
});
