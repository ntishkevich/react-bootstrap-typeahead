import isShown from '../../src/utils/isShown';
import options from '../../example/exampleData';

const baseProps = {
  emptyLabel: 'No matches found.',
  minLength: 0,
  showMenu: false,
  text: '',
};

describe('isShown', () => {
  test('shows the menu', () => {
    expect(isShown(options, {...baseProps, showMenu: true})).toBe(true);
  });

  test('shows the menu when `open` is true', () => {
    expect(isShown(options, {...baseProps, open: true})).toBe(true);
  });

  test('hides the menu when `open` is false', () => {
    const props = {
      ...baseProps,
      open: false,
      showMenu: true,
    };

    expect(isShown(options, props)).toBe(false);
  });

  test('hides the menu when `showMenu` is false', () => {
    expect(isShown(options, baseProps)).toBe(false);
  });

  test('hides the menu when the input value is less than `minLength`', () => {
    const props = {
      ...baseProps,
      minLength: 1,
      showMenu: true,
    };

    expect(isShown(options, props)).toBe(false);
  });

  test('hides the menu when there are no results and no empty label', () => {
    expect(isShown([], {...baseProps, emptyLabel: ''})).toBe(false);
  });
});
