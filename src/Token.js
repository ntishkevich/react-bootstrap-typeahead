import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import ClearButton from './ClearButton';

import tokenContainer from './containers/tokenContainer';
import {RETURN} from './constants';

/**
 * Token
 *
 * Individual token component, generally displayed within the TokenizerInput
 * component, but can also be rendered on its own.
 */
class Token extends React.Component {
  renderRemoveableToken = () => {
    const {active, children, className, onRemove, ...props} = this.props;

    return (
      <div
        {...props}
        className={cx('rbt-token', 'rbt-token-removeable', {
          'rbt-token-active': active,
        }, className)}>
        {children}
        <ClearButton
          className="rbt-token-remove-button"
          label="Remove"
          onClick={onRemove}
          onKeyDown={this.handleRemoveButtonKeydown}
          tabIndex={-1}
        />
      </div>
    );
  };

  renderToken = () => {
    const {children, className: classNameProp, disabled, href} = this.props;
    const className = cx('rbt-token', {
      'rbt-token-disabled': disabled,
    }, classNameProp);

    if (href) {
      return (
        <a className={className} href={href}>
          {children}
        </a>
      );
    }

    return (
      <div className={className}>
        {children}
      </div>
    );
  };

  handleRemoveButtonKeydown = (e) => {
    switch (e.keyCode) {
      case RETURN:
        this.props.onRemove();
        break;
      default:
        break;
    }
  };

  render() {
    return this.props.onRemove && !this.props.disabled ?
      this.renderRemoveableToken() :
      this.renderToken();
  }
}

Token.defaultProps = {
  active: false,
  tabIndex: 0,
};

Token.propTypes = {
  active: PropTypes.bool,
  /**
   * Handler for removing/deleting the token. If not defined, the token will
   * be rendered in a read-only state.
   */
  onRemove: PropTypes.func,
  tabIndex: PropTypes.number,
};

export default tokenContainer(Token);
