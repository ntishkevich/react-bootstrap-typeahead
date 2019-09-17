import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Loader = ({bsSize}) => (
  <div
    className={cx('rbt-loader', {
      'rbt-loader-lg': bsSize === 'large' || bsSize === 'lg',
      'rbt-loader-sm': bsSize === 'small' || bsSize === 'sm',
    })}
  />
);
Loader.defaultProps = {
  bsSize: 'sm',
};

Loader.propTypes = {
  bsSize: PropTypes.oneOf(['large', 'lg', 'small', 'sm']),
};

export default Loader;
