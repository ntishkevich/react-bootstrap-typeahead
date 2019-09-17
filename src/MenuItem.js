import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {noop} from 'lodash';

import menuItemContainer from './containers/menuItemContainer';

class BaseMenuItem extends Component {
  handleClick = (e) => {
    const {disabled, onClick} = this.props;

    e.preventDefault();
    if (!disabled) {
      onClick(e);
    }
  };

  render() {
    const {
      active,
      children,
      className,
      disabled,
      onClick,
      onMouseDown,
      ...props
    } = this.props;

    const conditionalClassNames = {
      active,
      disabled,
    };

    return (
      /* eslint-disable jsx-a11y/anchor-is-valid */
      <li
        {...props}
        className={cx(conditionalClassNames, className)}>
        <a
          className={cx('dropdown-item', conditionalClassNames)}
          href="#"
          onClick={this.handleClick}
          onMouseDown={onMouseDown}>
          {children}
        </a>
      </li>
      /* eslint-enable jsx-a11y/anchor-is-valid */
    );
  }
}

BaseMenuItem.defaultProps = {
  onClick: noop,
};

BaseMenuItem.propTypes = {
  onClick: PropTypes.func,
};

export {BaseMenuItem};
export default menuItemContainer(BaseMenuItem);
