import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Highlighter from './Highlighter';
import Menu from './Menu';
import MenuItem from './MenuItem';

import {getOptionLabel} from './utils';

class TypeaheadMenu extends Component {
  renderMenuItem = (option, idx) => {
    const {
      labelKey,
      newSelectionPrefix,
      renderMenuItemChildren,
      text,
    } = this.props;

    const label = getOptionLabel(option, labelKey);

    const menuItemProps = {
      disabled: option.disabled,
      key: idx,
      label,
      option,
      position: idx,
    };

    if (option.customOption) {
      return (
        <MenuItem
          {...menuItemProps}
          className="rbt-menu-custom-option"
          label={newSelectionPrefix + label}>
          {newSelectionPrefix}
          <Highlighter search={text}>
            {label}
          </Highlighter>
        </MenuItem>
      );
    }

    if (option.paginationOption) {
      return [
        <Menu.Divider key="pagination-item-divider" />,
        <MenuItem
          {...menuItemProps}
          className="rbt-menu-pagination-option"
          key="pagination-item">
          {label}
        </MenuItem>,
      ];
    }

    return (
      <MenuItem {...menuItemProps}>
        {renderMenuItemChildren(option, this.props, idx)}
      </MenuItem>
    );
  };

  render() {
    const {
      labelKey,
      newSelectionPrefix,
      options,
      renderMenuItemChildren,
      ...menuProps
    } = this.props;

    return (
      <Menu {...menuProps}>
        {options.map(this.renderMenuItem)}
      </Menu>
    );
  }
}

TypeaheadMenu.defaultProps = {
  newSelectionPrefix: 'New selection: ',
  renderMenuItemChildren: (option, props) => (
    <Highlighter search={props.text}>
      {getOptionLabel(option, props.labelKey)}
    </Highlighter>
  ),
};

TypeaheadMenu.propTypes = {
  /**
   * Provides the ability to specify a prefix before the user-entered text to
   * indicate that the selection will be new. No-op unless `allowNew={true}`.
   */
  newSelectionPrefix: PropTypes.string,
  /**
   * Provides a hook for customized rendering of menu item contents.
   */
  renderMenuItemChildren: PropTypes.func,
};


export default TypeaheadMenu;
