import React from 'react';
import {render, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Menu from '../../src/Menu';
import MenuItem from '../../src/MenuItem';

describe('<Menu>', () => {
  const options = [
    {label: 'Item 1'},
    {label: 'Item 2'},
    {label: 'Item 3'},
  ];
  const children = options.map((o, idx) => (
    <MenuItem
      key={o.label}
      option={o}
      position={idx}>
      {o.label}
    </MenuItem>
  ));

  afterEach(cleanup);

  test('renders a basic menu with menu items', () => {
    const {queryByRole} = render(
      <Menu
        id="menu-id"
        paginate={false}>
        {children}
      </Menu>
    );

    const dropdownMenu = queryByRole('listbox');
    expect(dropdownMenu).toBeDefined();
    expect(dropdownMenu).toHaveClass('rbt-menu dropdown-menu');
    expect(dropdownMenu.children).toHaveLength(children.length);
  });

  test('sets the maxHeight and other styles', () => {
    const style = {
      backgroundColor: 'red',
      maxHeight: '100px',
    };

    const {queryByRole, rerender} = render(
      <Menu
        id="menu-id"
        style={style}
        paginate={false}>
        {children}
      </Menu>
    );
    const menu = queryByRole('listbox');
    expect(menu).toHaveStyle(`backgroundColor: ${style}`);
    expect(menu).toHaveStyle(`maxHeight: ${style.maxHeight}`);

    style.maxHeight = '75%';
    rerender(
      <Menu
        id="menu-id"
        style={style}
        paginate={false}>
        {children}
      </Menu>
    );

    expect(menu).toHaveStyle(`maxHeight: ${style.maxHeight}`);
  });

  test('renders an empty label when there are no children', () => {
    const emptyLabel = 'No matches.';
    const {queryByRole, queryByText} = render(
      <Menu
        id="menu-id"
        emptyLabel={emptyLabel}
        paginate={false}
      />
    );

    const menu = queryByRole('listbox');
    expect(menu.children).toHaveLength(1);

    const emptyLabelItem = queryByText(emptyLabel);
    expect(emptyLabelItem).toBeDefined();
    expect(emptyLabelItem).toHaveTextContent(emptyLabel);
    expect(emptyLabelItem).toHaveClass('disabled');
  });
});
