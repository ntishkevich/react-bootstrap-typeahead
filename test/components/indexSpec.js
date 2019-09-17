
import {AsyncTypeahead, Highlighter, Menu, MenuItem, Token, Typeahead, TypeaheadMenu, asyncContainer, menuItemContainer, tokenContainer} from '../../src';
import _AsyncTypeahead from '../../src/AsyncTypeahead';
import _Highlighter from '../../src/Highlighter';
import _Menu from '../../src/Menu.react';
import _MenuItem from '../../src/MenuItem';
import _Token from '../../src/Token';
import _Typeahead from '../../src/Typeahead';
import _TypeaheadMenu from '../../src/TypeaheadMenu';
import _asyncContainer from '../../src/containers/asyncContainer';
import _menuItemContainer from '../../src/containers/menuItemContainer';
import _tokenContainer from '../../src/containers/tokenContainer';

describe('<HintedInput>', () => {
  it('AsyncTypeahead is exported', () => {
    expect(AsyncTypeahead).toEqual(_AsyncTypeahead);
  });

  it('Highlighter is exported', () => {
    expect(Highlighter).toEqual(_Highlighter);
  });

  it('Menu is exported', () => {
    expect(Menu).toEqual(_Menu);
  });

  it('MenuItem is exported', () => {
    expect(MenuItem).toEqual(_MenuItem);
  });

  it('Token is exported', () => {
    expect(Token).toEqual(_Token);
  });

  it('Typeahead is exported', () => {
    expect(Typeahead).toEqual(_Typeahead);
  });

  it('TypeaheadMenu is exported', () => {
    expect(TypeaheadMenu).toEqual(_TypeaheadMenu);
  });

  it('asyncContainer is exported', () => {
    expect(asyncContainer).toEqual(_asyncContainer);
  });

  it('menuItemContainer is exported', () => {
    expect(menuItemContainer).toEqual(_menuItemContainer);
  });

  it('tokenContainer is exported', () => {
    expect(tokenContainer).toEqual(_tokenContainer);
  });
});
