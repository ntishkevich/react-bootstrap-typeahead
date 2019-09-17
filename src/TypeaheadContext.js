import React, {createContext, forwardRef} from 'react';
import {noop, pick} from 'lodash';

const TypeaheadContext = createContext({
  activeIndex: -1,
  hintText: '',
  initialItem: null,
  isOnlyResult: false,
  onActiveItemChange: noop,
  onAdd: noop,
  onInitialItemChange: noop,
  onMenuItemClick: noop,
  selectHintOnEnter: false,
});

export const withContext = (Component, values) => {
  // Note: Use a class instead of function component to support refs.
  /* eslint-disable-next-line react/prefer-stateless-function */
  return forwardRef((props, ref) => {
    return (
      <TypeaheadContext.Consumer>
        {(context) => (
          <Component
            {...props}
            {...pick(context, values)}
            ref={ref}
          />
        )}
      </TypeaheadContext.Consumer>
    );
  });
};

export default TypeaheadContext;
