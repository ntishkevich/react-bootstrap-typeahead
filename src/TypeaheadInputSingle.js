import React, {Component} from 'react';
import cx from 'classnames';

import hintContainer from './containers/hintContainer';
import inputContainer from './containers/inputContainer';

class TypeaheadInputSingle extends Component {
  render() {
    const {className, inputRef, ...props} = this.props;

    return (
      <input
        {...props}
        className={cx('rbt-input-main', 'form-control', className)}
        ref={inputRef}
      />
    );
  }
}

export default inputContainer(hintContainer(TypeaheadInputSingle));
