import React, {Children, Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {isRequiredForA11y} from 'prop-types-extra';

import {BaseMenuItem} from './MenuItem';

/**
 * Menu component that handles empty state when passed a set of results.
 */
class Menu extends Component {
  componentDidUpdate(prevProps, prevState) {
    const {inputHeight, scheduleUpdate} = this.props;

    // Update the menu position if the height of the input changes.
    if (inputHeight !== prevProps.inputHeight) {
      scheduleUpdate();
    }
  }

  render() {
    const {
      children,
      className,
      emptyLabel,
      id,
      innerRef,
      maxHeight,
      style,
      text,
    } = this.props;

    const contents = Children.count(children) === 0 ?
      <BaseMenuItem disabled>
        {emptyLabel}
      </BaseMenuItem> :
      children;

    return (
      <ul
        className={cx('rbt-menu', 'dropdown-menu', 'show', className)}
        id={id}
        key={
          // Force a re-render if the text changes to ensure that menu
          // positioning updates correctly.
          text
        }
        ref={innerRef}
        role="listbox"
        style={{
          ...style,
          display: 'block',
          maxHeight,
          overflow: 'auto',
        }}>
        {contents}
      </ul>
    );
  }
}

Menu.propTypes = {
  /**
   * Needed for accessibility.
   */
  id: isRequiredForA11y(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ])),
  /**
   * Maximum height of the dropdown menu.
   */
  maxHeight: PropTypes.string,
};

Menu.defaultProps = {
  maxHeight: '300px',
};

Menu.Divider = () => (
  <li className="divider dropdown-divider" role="separator" />
);

Menu.Header = (props) => (
  <li {...props} className="dropdown-header" />
);

export default Menu;
