import {pick} from 'lodash';
import React from 'react';

import TypeaheadContext from '../TypeaheadContext';
import {getHintText, getIsOnlyResult} from '../utils';
import {RETURN} from '../constants';

function contextContainer(Typeahead) {
  class WrappedTypeahead extends React.Component {
    componentDidUpdate(prevProps, prevState) {
      const {allowNew, onInitialItemChange, results} = this.props;

      // Clear the initial item when there are no results.
      if (!(allowNew || results.length)) {
        onInitialItemChange(null);
      }
    }

    _handleKeyDown = (e) => {
      const {initialItem, onKeyDown, onAdd} = this.props;

      switch (e.keyCode) {
        case RETURN:
          if (getIsOnlyResult(this.props) && initialItem) {
            onAdd(initialItem);
          }
          break;
        default:
          break;
      }

      onKeyDown(e);
    };

    render() {
      const contextValues = pick(this.props, [
        'activeIndex',
        'initialItem',
        'onActiveItemChange',
        'onAdd',
        'onInitialItemChange',
        'onMenuItemClick',
        'selectHintOnEnter',
      ]);

      return (
        <TypeaheadContext.Provider
          value={{
            ...contextValues,
            hintText: getHintText(this.props),
            isOnlyResult: getIsOnlyResult(this.props),
          }}>
          <Typeahead
            {...this.props}
            onKeyDown={this._handleKeyDown}
          />
        </TypeaheadContext.Provider>
      );
    }
  }

  return WrappedTypeahead;
}

export default contextContainer;
