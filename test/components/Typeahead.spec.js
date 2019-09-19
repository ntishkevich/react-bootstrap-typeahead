import {mount} from 'enzyme';
import {head, noop} from 'lodash';
import React from 'react';
import {Popper} from 'react-popper';

import {Menu, MenuItem, Typeahead} from '../../src';

import {change, focus, getHint, getInput, getMenu, getMenuItems, getPaginator, getTokens, keyDown} from '../helpers';
import states from '../../example/exampleData';
import {DOWN, ESC, RETURN, RIGHT, TAB, UP} from '../../src/constants';

function cycleThroughMenuAndGetActiveItem(wrapper, dir) {
  keyDown(wrapper, dir);
  return wrapper.find('a.active');
}

function mountTypeahead(props) {
  return mount(
    <Typeahead
      labelKey="name"
      onChange={noop}
      options={states}
      {...props}
    />
  );
}

function getClearButton(wrapper) {
  return wrapper.find('.rbt-close');
}

function getPlacement(wrapper) {
  return wrapper.find(Popper).prop('placement');
}

function getState(wrapper) {
  return wrapper.instance().getInstance().state;
}

function getSelected(wrapper) {
  return getState(wrapper).selected;
}

function getText(wrapper) {
  return getState(wrapper).text;
}

function hasFocus(wrapper) {
  // Focus state is stored at the top level and propagated down to the input.
  // Check both.
  return (
    getState(wrapper).isFocused &&
    wrapper.find('.form-control').hasClass('focus')
  );
}

function setCursorPosition(wrapper, pos) {
  const input = getInput(wrapper);
  input.instance().selectionStart = pos;
  input.simulate('change');
}

describe('<Typeahead>', () => {
  let typeahead;

  beforeEach(() => {
    typeahead = mountTypeahead();
  });

  it('should have an input', () => {
    expect(typeahead.find('input.rbt-input-main')).toHaveLength(1);
  });

  it('should render in multi-select mode when `multiple=true`', () => {
    typeahead.setProps({multiple: true});
    expect(typeahead.find('.rbt-input-multi')).toHaveLength(1);
  });

  it('should display tokens when selections are passed in', () => {
    typeahead.setProps({
      multiple: true,
      selected: states.slice(0, 3),
    });
    expect(getTokens(typeahead)).toHaveLength(3);
  });

  it('set and unset the focus state on focus/blur', () => {
    const input = getInput(typeahead);

    expect(hasFocus(typeahead)).toEqual(false);

    input.simulate('focus');
    expect(hasFocus(typeahead)).toEqual(true);

    input.simulate('blur');
    expect(hasFocus(typeahead)).toEqual(false);
  });

  describe('input focus', () => {
    beforeEach(() => {
      typeahead.setProps({
        clearButton: true,
        selected: states.slice(0, 1),
      });

      focus(typeahead);
      expect(hasFocus(typeahead)).toEqual(true);
    });

    afterEach(() => {
      // The menu should close but the input stays focused.
      expect(getMenuItems(typeahead)).toHaveLength(0);
      expect(hasFocus(typeahead)).toEqual(true);
    });

    it('maintains focus when clicking a menu item', () => {
      getMenuItems(typeahead).first().simulate('click');
    });

    it('maintains focus when clicking the clear button', () => {
      getClearButton(typeahead).simulate('click');
    });
  });

  describe('behaviors when selections are passed in', () => {
    const multiSelections = states.slice(0, 4);

    it('truncates selections when using `defaultSelected`', () => {
      const wrapper = mountTypeahead({
        defaultSelected: multiSelections,
      });

      expect(getSelected(wrapper)).toHaveLength(1);
    });

    it('truncates selections when using `selected`', () => {
      typeahead.setProps({selected: multiSelections});

      expect(getSelected(typeahead)).toHaveLength(1);
    });

    it('truncates selections when going from multi- to single-select', () => {
      typeahead.setProps({
        multiple: true,
        selected: multiSelections,
      });

      expect(getSelected(typeahead)).toHaveLength(multiSelections.length);

      typeahead.setProps({multiple: false});

      expect(getSelected(typeahead)).toHaveLength(1);
      expect(getSelected(typeahead)).toEqual(states.slice(0, 1));
    });

    it('filters menu options based on `selected` values', () => {
      const selected = states.slice(0, 1);
      typeahead.setProps({selected});

      focus(typeahead);

      expect(getInput(typeahead).prop('value')).toEqual(head(selected).name);
      expect(getMenuItems(typeahead)).toHaveLength(1);
    });

    it('filters menu options based on `defaultSelected` values', () => {
      const defaultSelected = states.slice(0, 1);
      const value = head(defaultSelected).name;

      typeahead = mountTypeahead({defaultSelected});

      focus(typeahead);

      expect(getInput(typeahead).prop('value')).toEqual(value);
      expect(getMenuItems(typeahead)).toHaveLength(1);
    });
  });

  describe('input value behaviors', () => {
    let defaultInputValue, defaultSelected, selected;

    beforeEach(() => {
      defaultInputValue = 'This is a default value';
      /* eslint-disable-next-line no-multi-assign */
      defaultSelected = selected = states.slice(0, 1);
    });

    it('sets a default initial input value', () => {
      typeahead = mountTypeahead({defaultInputValue});
      expect(getInput(typeahead).prop('value')).toEqual(defaultInputValue);
    });

    it('sets an input value based on the `selected` value', () => {
      typeahead.setProps({selected});
      expect(getInput(typeahead).prop('value')).toEqual(head(selected).name);
    });

    it('sets an input value based on the `defaultSelected` value', () => {
      typeahead = mountTypeahead({defaultSelected});
      const inputValue = getInput(typeahead).prop('value');
      expect(inputValue).toEqual(head(defaultSelected).name);
    });

    it('overrides the initial input value', () => {
      typeahead = mountTypeahead({defaultInputValue, selected});
      expect(getInput(typeahead).prop('value')).toEqual(head(selected).name);
    });
  });

  describe('menu visibility behavior', () => {
    it('shows the menu on initial render', () => {
      typeahead = mountTypeahead({defaultOpen: true});
      expect(getState(typeahead).showMenu).toEqual(true);
      expect(getMenu(typeahead)).toHaveLength(1);
    });

    it('shows the menu when `open` is `true`', () => {
      typeahead.setProps({open: true});

      // TODO: Menu isn't immediately rendered when changing props in testing
      // environment for some reason. For now, test that it at least stays open
      // when blurred.
      focus(typeahead);
      getInput(typeahead).simulate('blur');

      expect(getMenu(typeahead)).toHaveLength(1);
    });

    it('hides the menu when `open` is `false`', () => {
      typeahead.setProps({open: false});
      focus(typeahead);
      expect(getMenu(typeahead)).toHaveLength(0);
    });

    it('shows the menu when the input is focused', () => {
      focus(typeahead);
      expect(getMenu(typeahead)).toHaveLength(1);
    });

    it('hides the menu on focus when `minLength=1`', () => {
      typeahead.setProps({minLength: 1});
      focus(typeahead);
      expect(getMenu(typeahead)).toHaveLength(0);
    });

    it(
      'shows the menu when there are no results, `allowNew=true`, ' +
      'and `emptyLabel` is falsy', () => {
        typeahead.setProps({
          allowNew: true,
          emptyLabel: false,
          options: [],
        });
        change(typeahead, 'xx');
        focus(typeahead);

        const menuItems = getMenuItems(typeahead);
        expect(menuItems).toHaveLength(1);
        expect(menuItems.text()).toEqual('New selection: xx');
      }
    );
  });

  it('should not display a menu if `emptyLabel` is falsy', () => {
    function getMenuWithEmptyLabel(emptyLabel) {
      typeahead = mountTypeahead({emptyLabel, options: []});
      focus(typeahead);
      return getMenu(typeahead);
    }

    let menuNode = getMenuWithEmptyLabel('');
    expect(menuNode).toHaveLength(0);

    menuNode = getMenuWithEmptyLabel(null);
    expect(menuNode).toHaveLength(0);

    menuNode = getMenuWithEmptyLabel(0);
    expect(menuNode).toHaveLength(0);
  });

  it('should disable the input if the component is disabled', () => {
    const input = typeahead
      .setProps({disabled: true})
      .find('.form-control');

    expect(input.prop('disabled')).toEqual(true);
  });

  it('should not highlight disabled options', () => {
    let activeItem;

    const options = [
      {name: 'foo'},
      {disabled: true, name: 'bar'},
      {disabled: true, name: 'boo'},
      {name: 'baz'},
    ];

    typeahead = mountTypeahead({options});
    focus(typeahead);

    // Cycling down should activate the first option.
    activeItem = cycleThroughMenuAndGetActiveItem(typeahead, DOWN);
    expect(activeItem.text()).toEqual(options[0].name);

    // Cycling down should skip the two disabled option.
    activeItem = cycleThroughMenuAndGetActiveItem(typeahead, DOWN);
    expect(activeItem.text()).toEqual(options[3].name);

    // Cycling back up should again skip the two disabled option.
    activeItem = cycleThroughMenuAndGetActiveItem(typeahead, UP);
    expect(activeItem.text()).toEqual(options[0].name);
  });

  it(
    'should not highlight disabled option which is the last in the list',
    () => {
      const options = [
        {name: 'foo'},
        {name: 'bar'},
        {disabled: true, name: 'boo'},
      ];

      typeahead = mountTypeahead({options});
      focus(typeahead);

      // Cycling back up should skip the last option disabled.
      const activeOption = cycleThroughMenuAndGetActiveItem(typeahead, UP);
      expect(activeOption.text()).toEqual(options[1].name);
    }
  );

  describe('pagination behaviors', () => {
    let maxResults, onPaginate, shownResultsCount;

    beforeEach(() => {
      maxResults = 10;
      shownResultsCount = maxResults;

      onPaginate = jest.fn((e, shownResults) => {
        shownResultsCount = shownResults;
      });

      typeahead = mountTypeahead({
        maxResults,
        onPaginate,
      });
    });

    it('has a menu item for pagination', () => {
      focus(typeahead);
      const paginator = getPaginator(typeahead);

      expect(paginator).toHaveLength(1);
      expect(paginator.text()).toEqual('Display additional results...');
    });

    it('calls `onPaginate` when the menu item is clicked', () => {
      focus(typeahead);
      typeahead
        .find('.rbt-menu-pagination-option a')
        .hostNodes()
        .simulate('click');

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toEqual(maxResults * 2);
      expect(getMenuItems(typeahead)).toHaveLength(21);
    });

    it('calls `onPaginate` when the return key is pressed', () => {
      focus(typeahead);
      keyDown(typeahead, UP);
      keyDown(typeahead, RETURN);

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toEqual(maxResults * 2);
      expect(getMenuItems(typeahead)).toHaveLength(21);
    });

    it('calls `onPaginate` when `labelKey` is a function', () => {
      typeahead.setProps({labelKey: (o) => o.name});

      focus(typeahead);
      keyDown(typeahead, UP);
      keyDown(typeahead, RETURN);

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toEqual(maxResults * 2);
      expect(getMenuItems(typeahead)).toHaveLength(21);
    });

    it(
      'does not call `onPaginate` when the right arrow or tab keys are ' +
      'pressed', () => {
        focus(typeahead);

        keyDown(typeahead, UP);
        keyDown(typeahead, RIGHT);

        expect(onPaginate).not.toBeCalled();

        keyDown(typeahead, TAB);
        expect(onPaginate).not.toBeCalled();

        // The menu should close when the tab key is pressed.
        expect(getMenuItems(typeahead)).toHaveLength(0);
      }
    );

    it('displays custom pagination text', () => {
      const paginationText = 'More Results...';
      typeahead.setProps({paginationText});

      focus(typeahead);
      expect(getPaginator(typeahead).text()).toEqual(paginationText);
    });

    it('does not have a menu item for pagination', () => {
      typeahead.setProps({paginate: false});

      focus(typeahead);
      expect(getPaginator(typeahead)).toHaveLength(0);
    });

    it('resets the shown results when the input value changes', () => {
      maxResults = 5;
      typeahead.setProps({maxResults});

      change(typeahead, 'ar');
      focus(typeahead);
      keyDown(typeahead, UP);
      keyDown(typeahead, RETURN);

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toEqual(maxResults * 2);

      change(typeahead, 'or');
      focus(typeahead);
      keyDown(typeahead, UP);
      keyDown(typeahead, RETURN);

      expect(onPaginate).toHaveBeenCalledTimes(2);
      expect(shownResultsCount).toEqual(maxResults * 2);
    });

    it('updates the active item after pagination', () => {
      focus(typeahead);
      keyDown(typeahead, UP);

      const {activeItem} = getState(typeahead);
      expect(activeItem.paginationOption).toEqual(true);

      keyDown(typeahead, RETURN);
      expect(getState(typeahead).activeItem).toEqual(states[maxResults]);
    });
  });

  describe('should limit the results when `maxResults` is set', () => {
    const maxResults = 5;

    beforeEach(() => {
      typeahead = mountTypeahead({maxResults});
    });

    it('should limit results when `paginate=true`', () => {
      focus(typeahead);

      // When `paginate` is true, there will be a pagination menu item in
      // addition to the shown results.
      expect(getMenuItems(typeahead)).toHaveLength(maxResults + 1);
    });

    it('should limit results when `paginate=false`', () => {
      typeahead.setProps({paginate: false});
      focus(typeahead);

      expect(getMenuItems(typeahead)).toHaveLength(maxResults);
    });
  });

  it('changes the menu\'s horizontal positioning', () => {
    focus(typeahead);

    expect(getPlacement(typeahead)).toEqual('bottom-start');

    typeahead.setProps({align: 'right'});
    expect(getPlacement(typeahead)).toEqual('bottom-end');

    typeahead.setProps({align: 'left'});
    expect(getPlacement(typeahead)).toEqual('bottom-start');
  });

  it('should position the menu above the input when `dropup=true`', () => {
    typeahead.setProps({dropup: true});
    focus(typeahead);

    expect(getPlacement(typeahead)).toEqual('top-start');
  });

  it('renders a large input', () => {
    const input = typeahead
      .setProps({bsSize: 'large'})
      .find('.form-control');

    expect(input.hasClass('input-lg form-control-lg')).toEqual(true);
  });

  it('renders a small input', () => {
    const input = typeahead
      .setProps({bsSize: 'small'})
      .find('.form-control');

    expect(input.hasClass('input-sm form-control-sm')).toEqual(true);
  });

  it('renders a loading indicator', () => {
    typeahead.setProps({isLoading: true});
    expect(typeahead.find('.rbt-loader')).toHaveLength(1);
  });

  describe('ClearButton behavior', () => {
    beforeEach(() => {
      typeahead = mountTypeahead();
    });

    it('displays a clear button when there are selections', () => {
      typeahead.setProps({
        clearButton: true,
        selected: states.slice(0, 1),
      });

      expect(getClearButton(typeahead)).toHaveLength(1);
    });

    it('does not display a clear button when there are no selections', () => {
      typeahead.setProps({
        clearButton: true,
        selected: [],
      });
      expect(getClearButton(typeahead)).toHaveLength(0);
    });
  });

  describe('updates when re-rendering with new props', () => {
    it('acts as a controlled input in single-select mode', () => {
      const selected1 = states.slice(0, 1);
      const selected2 = states.slice(1, 2);

      // Pass in new selection
      typeahead.setProps({selected: selected1});

      expect(getSelected(typeahead)).toEqual(selected1);
      expect(getText(typeahead)).toEqual(head(selected1).name);

      // Pass in another new selection
      typeahead.setProps({selected: selected2});

      expect(getSelected(typeahead)).toEqual(selected2);
      expect(getText(typeahead)).toEqual(head(selected2).name);

      // Clear the selections.
      typeahead.setProps({selected: []});

      expect(getSelected(typeahead)).toEqual([]);
      expect(getText(typeahead)).toEqual('');
    });

    it('acts as a controlled input in multi-select mode', () => {
      const selected1 = states.slice(0, 4);

      // Pass in new selection
      typeahead.setProps({
        multiple: true,
        selected: selected1,
      });

      expect(getSelected(typeahead)).toEqual(selected1);
      expect(getText(typeahead)).toEqual('');

      // Clear the selections.
      typeahead.setProps({selected: []});

      expect(getSelected(typeahead)).toEqual([]);
      expect(getText(typeahead)).toEqual('');
    });

    it('updates the selections and input value in single-select mode', () => {
      typeahead.setProps({
        // Simulate a controlled component.
        onChange: (selected) => typeahead.setProps({selected}),
        selected: states.slice(0, 1),
      });

      expect(getSelected(typeahead)).toHaveLength(1);
      expect(getText(typeahead)).toEqual('Alabama');

      // Simulate deleting the last character.
      change(typeahead, 'Alabam');

      // Text entry should clear the selection and keep the entry.
      expect(getSelected(typeahead)).toHaveLength(0);
      expect(getText(typeahead)).toEqual('Alabam');
    });
  });

  describe('`highlightOnlyResult` behavior', () => {
    let selected;

    beforeEach(() => {
      selected = [];
      typeahead = mountTypeahead({
        onChange: (s) => selected = [s],
      });
    });

    it('does not highlight the only result', () => {
      change(typeahead, 'Alab');
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems).toHaveLength(1);
      expect(menuItems.hasClass('active')).toEqual(false);

      keyDown(typeahead, RETURN);

      expect(selected).toHaveLength(0);
    });

    it('highlights the only result', () => {
      typeahead.setProps({highlightOnlyResult: true});

      change(typeahead, 'Alab');
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems).toHaveLength(1);
      expect(menuItems.hasClass('active')).toEqual(true);

      keyDown(typeahead, RETURN);

      expect(selected).toHaveLength(1);
    });

    it('is compatible with `open=false`', () => {
      typeahead.setProps({highlightOnlyResult: true, open: false});

      change(typeahead, 'Alab');
      focus(typeahead);

      keyDown(typeahead, RETURN);
    });

    it('does not highlight the only result when `allowNew=true`', () => {
      typeahead.setProps({
        allowNew: true,
        highlightOnlyResult: true,
      });

      change(typeahead, 'qqq');
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems).toHaveLength(1);
      expect(menuItems.hasClass('active')).toEqual(false);

      keyDown(typeahead, RETURN);

      expect(selected).toHaveLength(0);
    });

    it('does not highlight or select a disabled result', () => {
      typeahead.setProps({
        highlightOnlyResult: true,
        options: [
          {name: 'foo'},
          {disabled: true, name: 'bar'},
          {disabled: true, name: 'boo'},
          {name: 'baz'},
        ],
      });

      change(typeahead, 'bar');
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems).toHaveLength(1);
      expect(menuItems.hasClass('active')).toBe(false);

      keyDown(typeahead, RETURN);

      expect(selected).toHaveLength(0);
    });
  });

  describe('applies attributes to the input', () => {
    let inputProps;

    beforeEach(() => {
      inputProps = {
        autoComplete: 'off',
        className: 'input-classname',
        id: 'input-id',
        name: 'input-name',
        tabIndex: 5,
        type: 'number',
      };

      typeahead.setProps({inputProps});
    });

    afterEach(() => {
      const props = getInput(typeahead).props();

      expect(props.autoComplete).toEqual(inputProps.autoComplete);
      expect(props.className).toContain(inputProps.className);
      expect(props.id).toEqual(inputProps.id);
      expect(props.name).toEqual(inputProps.name);
      expect(props.tabIndex).toEqual(inputProps.tabIndex);
      expect(props.type).toEqual(inputProps.type);
    });

    it('in single-select mode', () => {
      // Continue to `afterEach`
    });

    it('in multi-select mode', () => {
      typeahead.setProps({
        multiple: true,
        selected: states.slice(0, 1),
      });

      expect(getTokens(typeahead).prop('tabIndex')).toEqual(inputProps.tabIndex);
    });
  });

  it('triggers the `onKeyDown` callback', () => {
    const onKeyDown = jest.fn();

    typeahead.setProps({onKeyDown});
    keyDown(typeahead, RETURN);

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  describe('menu visibility hooks', () => {
    it('calls `onMenuShow`', () => {
      const onMenuShow = jest.fn();

      typeahead.setProps({onMenuShow});

      expect(onMenuShow).not.toBeCalled();

      focus(typeahead);
      expect(onMenuShow).toHaveBeenCalledTimes(1);

      // Shouldn't be called again if not hidden first.
      focus(typeahead);
      expect(onMenuShow).toHaveBeenCalledTimes(1);
    });

    it('calls `onMenuHide`', () => {
      const onMenuHide = jest.fn();

      typeahead.setProps({onMenuHide});

      focus(typeahead);
      expect(onMenuHide).not.toHaveBeenCalled();

      keyDown(typeahead, ESC);
      expect(onMenuHide).toHaveBeenCalledTimes(1);

      // Shouldn't be called again if not shown first.
      keyDown(typeahead, ESC);
      expect(onMenuHide).toHaveBeenCalledTimes(1);
    });

    it('calls `onMenuToggle`', () => {
      const onMenuToggle = jest.fn();

      typeahead.setProps({onMenuToggle});

      expect(onMenuToggle).not.toHaveBeenCalled();

      focus(typeahead);
      expect(onMenuToggle).toHaveBeenCalledTimes(1);

      // Shouldn't be called again if not hidden first.
      focus(typeahead);
      expect(onMenuToggle).toHaveBeenCalledTimes(1);

      keyDown(typeahead, ESC);
      expect(onMenuToggle).toHaveBeenCalledTimes(2);
    });
  });

  describe('hint behavior', () => {
    beforeEach(() => {
      typeahead = mountTypeahead({defaultInputValue: 'Ala'});
    });

    it('does not display a hint when the input is not focused', () => {
      expect(hasFocus(typeahead)).toEqual(false);
      expect(getHint(typeahead)).toEqual('');
    });

    it('displays a hint when the input is focused', () => {
      focus(typeahead);
      expect(getHint(typeahead)).toEqual('Alabama');
    });

    it('displays a hint in multi-select mode', () => {
      typeahead.setProps({multiple: true});

      change(typeahead, 'Ala');
      focus(typeahead);

      expect(getHint(typeahead)).toEqual('Alabama');
    });

    it('does not display a hint if the menu is hidden', () => {
      focus(typeahead);

      // When focused, the typeahead should show the menu and hint text.
      expect(getMenu(typeahead)).toHaveLength(1);
      expect(getHint(typeahead)).toEqual('Alabama');

      keyDown(typeahead, ESC);

      // Expect the input to remain focused, but the menu and hint to be hidden.
      expect(hasFocus(typeahead)).toEqual(true);
      expect(getMenu(typeahead)).toHaveLength(0);
      expect(getHint(typeahead)).toEqual('');
    });
  });

  describe('behavior when selecting the hinted result', () => {
    let keyCode;

    beforeEach(() => {
      keyCode = 0;

      typeahead.setProps({
        /* eslint-disable-next-line prefer-destructuring */
        onKeyDown: (e) => keyCode = e.keyCode,
      });

      change(typeahead, 'Ala');
      focus(typeahead);
    });

    it('should select the hinted result on tab keydown', () => {
      keyDown(typeahead, TAB);

      expect(keyCode).toEqual(TAB);
      expect(getSelected(typeahead)).toHaveLength(1);
    });

    it('should select the hinted result on right arrow keydown', () => {
      setCursorPosition(typeahead, getText(typeahead).length);
      keyDown(typeahead, RIGHT);

      expect(keyCode).toEqual(RIGHT);
      expect(getSelected(typeahead)).toHaveLength(1);
    });

    it(
      'should not select the hinted result on right arrow keydown unless ' +
      'the cursor is at the end of the input value',
      () => {
        setCursorPosition(typeahead, 1);
        keyDown(typeahead, RIGHT);

        expect(keyCode).toEqual(RIGHT);
        expect(getSelected(typeahead)).toHaveLength(0);
      }
    );

    it('should not select the hinted result on enter keydown', () => {
      keyDown(typeahead, RETURN);

      expect(keyCode).toEqual(RETURN);
      expect(getSelected(typeahead)).toHaveLength(0);
    });

    it('should select the hinted result on enter keydown', () => {
      typeahead.setProps({selectHintOnEnter: true});
      keyDown(typeahead, RETURN);

      expect(keyCode).toEqual(RETURN);
      expect(getSelected(typeahead)).toHaveLength(1);
    });
  });

  describe('behavior when selecting the active item', () => {
    beforeEach(() => {
      // Focus and navigate to the first result.
      focus(typeahead);
      keyDown(typeahead, DOWN);
      expect(getSelected(typeahead)).toHaveLength(0);
    });

    it('selects the active item when pressing return', () => {
      keyDown(typeahead, RETURN);
      expect(getSelected(typeahead)).toHaveLength(1);
    });

    it('selects the active item when pressing right', () => {
      keyDown(typeahead, RIGHT);
      expect(getSelected(typeahead)).toHaveLength(1);
    });

    it('selects the active item when pressing tab', () => {
      keyDown(typeahead, TAB);
      expect(getSelected(typeahead)).toHaveLength(1);
    });
  });

  describe('form submission', () => {
    let event;

    const onKeyDown = (e) => event = e;

    beforeEach(() => {
      event = null;
      typeahead.setProps({onKeyDown});
    });

    it('prevents form submission when the menu is open', () => {
      focus(typeahead);
      keyDown(typeahead, RETURN);

      expect(event.defaultPrevented).toEqual(true);
    });

    it('allows form submission when the menu is closed', () => {
      focus(typeahead);
      keyDown(typeahead, ESC); // Close the menu
      keyDown(typeahead, RETURN);

      expect(event.defaultPrevented).toBeUndefined();
    });
  });

  describe('accessibility status', () => {
    let statusNode;

    beforeEach(() => {
      focus(typeahead);
      statusNode = typeahead.find('.rbt-sr-status');
    });

    it('lists the number of results when the input is focused', () => {
      expect(statusNode.text()).toContain('50 results');
    });

    it('lists the number of selected items', () => {
      keyDown(typeahead, DOWN);
      keyDown(typeahead, RETURN);

      expect(statusNode.text()).toContain('1 selection');
    });
  });

  describe('accessibility attributes', () => {
    it('adds an id to the menu for accessibility', () => {
      expect(getInput(typeahead).prop('aria-owns')).toBeUndefined();

      focus(typeahead);

      // Default id.
      expect(getMenu(typeahead).prop('id')).toContain('rbt-menu-');
      expect(getInput(typeahead).prop('aria-owns')).toContain('rbt-menu-');

      const menuId = 'my-id';
      typeahead.setProps({menuId});

      expect(getMenu(typeahead).prop('id')).toEqual(menuId);
      expect(getInput(typeahead).prop('aria-owns')).toEqual(menuId);
    });

    it('sets the input `role`', () => {
      // Single-select
      expect(getInput(typeahead).prop('role')).toEqual('combobox');

      // Multi-select
      typeahead.setProps({multiple: true});
      expect(getInput(typeahead).prop('role')).toBeUndefined();
    });

    it('sets the input `aria-autocomplete` description', () => {
      // Single-select
      expect(getInput(typeahead).prop('aria-autocomplete')).toEqual('both');

      // Multi-select
      typeahead.setProps({multiple: true});
      expect(getInput(typeahead).prop('aria-autocomplete')).toEqual('list');
    });

    it('sets the input `aria-expanded` description', () => {
      // Single-select
      expect(getInput(typeahead).prop('aria-expanded')).toEqual(false);

      focus(typeahead);
      expect(getInput(typeahead).prop('aria-expanded')).toEqual(true);

      // Multi-select
      typeahead.setProps({multiple: true});
      expect(getInput(typeahead).prop('aria-expanded')).toBeUndefined();
    });

    it('sets the input `aria-activedescendant` description', () => {
      expect(getInput(typeahead).prop('aria-activedescendant')).toBeUndefined();

      focus(typeahead);
      keyDown(typeahead, DOWN);

      expect(getInput(typeahead).prop('aria-activedescendant')).toEqual('rbt-menu-item-0');
    });

    it('sets menu item attributes', () => {
      focus(typeahead);

      const menuItem = typeahead.find('.rbt-menu li').first();
      expect(menuItem.prop('aria-label')).toEqual('Alabama');
      expect(menuItem.prop('aria-selected')).toEqual(false);
      expect(menuItem.prop('role')).toEqual('option');

      keyDown(typeahead, DOWN);
      expect(typeahead.find('.rbt-menu li').first().prop('aria-selected')).toEqual(true);
    });
  });

  describe('bodyContainer behavior', () => {
    it('renders the menu inline', () => {
      focus(typeahead);
      const menuNode = getMenu(typeahead).instance();
      expect(menuNode.parentNode.nodeName).toEqual('DIV');
    });

    it('appends the menu to the document body', () => {
      typeahead.setProps({bodyContainer: true});
      focus(typeahead);

      const menuNode = getMenu(typeahead).instance();
      expect(menuNode.parentNode.nodeName).toEqual('BODY');
    });
  });

  it('calls the public `clear` method', () => {
    const wrapper = mountTypeahead({
      defaultSelected: states.slice(0, 1),
    });

    expect(getSelected(wrapper)).toHaveLength(1);
    expect(getText(wrapper)).toEqual('Alabama');

    wrapper.instance().getInstance().clear();

    expect(getSelected(wrapper)).toHaveLength(0);
    expect(getText(wrapper)).toEqual('');
  });

  describe('clear-on-select behavior', () => {
    let onChange;

    afterEach(() => {
      typeahead.setProps({onChange});

      // Simulate a manual selection.
      focus(typeahead);
      getMenuItems(typeahead).first().simulate('click');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(getSelected(typeahead)).toHaveLength(0);
      expect(getText(typeahead)).toEqual('');
    });

    it('clears an uncontrolled typeahead after selection', () => {
      onChange = jest.fn(() => {
        typeahead.instance().getInstance().clear();
      });
    });

    it('clears a controlled typeahead after selection', () => {
      onChange = jest.fn(() => {
        typeahead.setProps({selected: []});
      });
    });
  });

  describe('`onChange` and `onInputChange` behaviors', () => {
    let onChange;
    let onInputChange;
    let selected;

    beforeEach(() => {
      onChange = jest.fn();
      onInputChange = jest.fn();
      selected = states.slice(0, 1);

      typeahead.setProps({onChange, onInputChange});

      expect(onChange).not.toHaveBeenCalled();
      expect(onInputChange).not.toHaveBeenCalled();
    });

    it('calls `onChange` when a menu item is clicked', () => {
      focus(typeahead);
      getMenuItems(typeahead).first().simulate('click');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onInputChange).not.toHaveBeenCalled();
    });

    it('calls `onChange` when a menu item is selected via keyboard', () => {
      focus(typeahead);
      keyDown(typeahead, DOWN);
      keyDown(typeahead, RETURN);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onInputChange).not.toHaveBeenCalled();
    });

    it(
      'calls `onChange` once when a menu item is selected via keyboard and ' +
      '`selectHintOnEnter={true}`',
      () => {
        typeahead.setProps({selectHintOnEnter: true});

        focus(typeahead);
        keyDown(typeahead, DOWN);
        keyDown(typeahead, RETURN);

        expect(onChange).toHaveBeenCalledTimes(1);
      }
    );

    it('calls `onChange` when clicking the clear button', () => {
      typeahead.setProps({
        clearButton: true,
        selected,
      });
      getClearButton(typeahead).simulate('click');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onInputChange).not.toHaveBeenCalled();
    });

    it('calls `onInputChange` when text is entered in the input', () => {
      focus(typeahead);
      change(typeahead, 'z');
      expect(onInputChange).toHaveBeenCalledTimes(1);
    });

    it('`onInputChange` receives an event as the second param', () => {
      let event = null;

      typeahead.setProps({
        onInputChange: (text, e) => event = e,
      });

      focus(typeahead);
      change(typeahead, 'z');

      expect(event).not.toBeNull();
    });

    it('calls `onChange` when there is a selection and text is entered', () => {
      typeahead.setProps({selected});

      expect(getSelected(typeahead)).toHaveLength(1);

      focus(typeahead);
      change(typeahead, 'z');

      expect(onInputChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(getSelected(typeahead)).toHaveLength(0);
    });

    it('does not call either when selections are updated via props', () => {
      typeahead.setProps({selected});

      expect(onChange).not.toHaveBeenCalled();
      expect(onInputChange).not.toHaveBeenCalled();
    });

    it('does not call either when `clear()` is called externally', () => {
      const wrapper = mountTypeahead({
        defaultSelected: selected,
      });

      expect(getSelected(wrapper)).toHaveLength(1);
      expect(getText(wrapper)).toEqual(head(selected).name);

      wrapper.instance().getInstance().clear();

      expect(getSelected(wrapper)).toHaveLength(0);
      expect(getText(wrapper)).toEqual('');
      expect(onChange).not.toHaveBeenCalled();
      expect(onInputChange).not.toHaveBeenCalled();
    });
  });

  it('opens the menu when the up or down arrow keys are pressed', () => {
    focus(typeahead);
    expect(getState(typeahead).showMenu).toEqual(true);

    keyDown(typeahead, ESC);
    expect(getState(typeahead).showMenu).toEqual(false);

    keyDown(typeahead, DOWN);
    expect(getState(typeahead).showMenu).toEqual(true);

    keyDown(typeahead, ESC);
    expect(getState(typeahead).showMenu).toEqual(false);

    keyDown(typeahead, UP);
    expect(getState(typeahead).showMenu).toEqual(true);
  });

  /**
   * Some basic tests for the custom menu-rendering use-case.
   * Helps ensure that the context-related logic doesn't break.
   */
  describe('behaviors when rendering a custom menu', () => {
    let wrapper;

    beforeEach(() => {
      // Render a menu with states in reverse alphabetical order.
      wrapper = mountTypeahead({
        renderMenu: (results, menuProps) => (
          <Menu {...menuProps}>
            {results.reverse().map((r, idx) => (
              /* eslint-disable-next-line react/no-array-index-key */
              <MenuItem key={idx} option={r} position={idx}>
                {r.name}
              </MenuItem>
            ))}
          </Menu>
        ),
      });
    });

    it('renders the custom menu', () => {
      focus(wrapper);

      // Make sure the rendered menu and the internal state agree.
      expect(getState(wrapper).initialItem.name).toEqual('Wyoming');
      expect(getMenuItems(wrapper).first().text()).toEqual('Wyoming');
    });

    it('shows the correct hint', () => {
      change(wrapper, 'u');
      focus(wrapper); // Focus needs to come after change.

      expect(getMenuItems(wrapper).first().text()).toEqual('Utah');
      expect(getHint(wrapper)).toEqual('utah');
    });

    it('selects the correct option', () => {
      focus(wrapper);
      keyDown(wrapper, DOWN);

      expect(getState(wrapper).activeItem.name).toEqual('Wyoming');

      keyDown(wrapper, RETURN);
      expect(getSelected(wrapper)[0].name).toEqual('Wyoming');
    });
  });

  it('renders custom content in the menu items', () => {
    typeahead.setProps({
      // Render the capital instead of the state name.
      renderMenuItemChildren: (option) => option.capital,
    });

    focus(typeahead);

    expect(getMenuItems(typeahead).first().text()).toEqual('Montgomery');
  });

  it('renders custom tokens', () => {
    typeahead.setProps({
      multiple: true,
      renderToken: (option, props, idx) => (
        <div className="custom-token" key={idx}>
          {option.capital}
        </div>
      ),
      selected: states.slice(0, 1),
    });

    expect(typeahead.find('.custom-token').text()).toEqual('Montgomery');
  });

  it('renders children', () => {
    const text = 'This is the child';
    const children = <div className="children">{text}</div>;

    typeahead.setProps({children});

    expect(typeahead.find('.children').text()).toEqual(text);
  });

  it('renders children via a render function', () => {
    const children = (props) => (
      <div className="children">
        The menu {props.isMenuShown ? 'is' : 'is not'} open
      </div>
    );

    typeahead.setProps({children});

    expect(typeahead.find('.children').text()).toEqual('The menu is not open');

    focus(typeahead);

    expect(typeahead.find('.children').text()).toEqual('The menu is open');
  });

  describe('validation states', () => {
    beforeEach(() => {
      typeahead.setProps({
        isInvalid: true,
        isValid: true,
      });
    });

    afterEach(() => {
      const input = typeahead.find('.form-control');

      expect(input.hasClass('is-invalid')).toEqual(true);
      expect(input.hasClass('is-valid')).toEqual(true);
    });

    it('renders with validation classnames in single-select mode', () => {
      typeahead.setProps({multiple: false});
    });

    it('renders with validation classnames in multi-select mode', () => {
      typeahead.setProps({multiple: true});
    });
  });

  describe('allowNew behavior', () => {
    let emptyLabel, newSelectionPrefix, text;

    beforeEach(() => {
      emptyLabel = 'No results...';
      newSelectionPrefix = 'New selection: ';
      text = 'xxx';

      typeahead.setProps({
        emptyLabel,
        newSelectionPrefix,
      });
    });

    it('omits the custom option when `allowNew` is set to `false`', () => {
      typeahead.setProps({
        allowNew: false,
      });

      change(typeahead, text);
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems).toHaveLength(1);
      expect(menuItems.at(0).text()).toEqual(emptyLabel);
    });

    it('adds the custom option when `allowNew` is set to `true`', () => {
      typeahead.setProps({
        allowNew: true,
      });

      change(typeahead, text);
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems).toHaveLength(1);
      expect(menuItems.at(0).text()).toEqual(`${newSelectionPrefix}${text}`);
    });

    it('omits the custom option when there is an exact text match', () => {
      text = 'North Carolina';

      typeahead.setProps({
        allowNew: true,
      });

      change(typeahead, text);
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems).toHaveLength(1);
      expect(menuItems.at(0).text()).toEqual(text);
    });

    it('adds a custom option when `allowNew` returns true', () => {
      text = 'North Carolina';

      typeahead.setProps({
        allowNew: () => true,
      });

      change(typeahead, text);
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems).toHaveLength(2);
      expect(menuItems.at(0).text()).toEqual(text);
      expect(menuItems.at(1).text()).toEqual(`${newSelectionPrefix}${text}`);
    });

    it('omits new option when `allowNew` returns false', () => {
      text = 'North Carolina';

      typeahead.setProps({
        allowNew: () => false,
      });

      change(typeahead, text);
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems).toHaveLength(1);
      expect(menuItems.at(0).text()).toEqual(text);
    });
  });
});
