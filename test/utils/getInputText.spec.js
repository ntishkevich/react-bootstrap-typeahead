import getInputText from '../../src/utils/getInputText';
import options from '../../example/exampleData';

const labelKey = 'name';
const baseArgs = {
  activeItem: null,
  labelKey,
  multiple: false,
  selected: [],
  text: '',
};

describe('getInputText', () => {
  test('returns an empty string when no text is entered', () => {
    const inputText = getInputText(baseArgs);
    expect(inputText).toEqual('');
  });

  test('returns the input text in multiple mode', () => {
    const text = 'Cali';
    const inputText = getInputText({
      ...baseArgs,
      multiple: true,
      text,
    });

    expect(inputText).toEqual(text);
  });

  test('returns the active option label in single-select mode', () => {
    const name = 'California';
    const inputText = getInputText({
      ...baseArgs,
      activeItem: {name},
    });

    expect(inputText).toEqual(name);
  });

  test('returns the active option label in multi-select mode', () => {
    const name = 'California';
    const inputText = getInputText({
      ...baseArgs,
      activeItem: {name},
      multiple: true,
    });

    expect(inputText).toEqual(name);
  });

  test('returns the input text if the pagination item is active', () => {
    const args = {
      ...baseArgs,
      activeItem: {
        [labelKey]: 'More Results...',
        paginationOption: true,
      },
      text: 'foo',
    };

    expect(getInputText(args)).toEqual('foo');
  });

  test('returns the selected item label in single-select mode', () => {
    const selected = options.slice(0, 1);
    const inputText = getInputText({...baseArgs, selected});
    expect(inputText).toEqual(selected[0][labelKey]);
  });

  test('does not return the selected item label in multi-select mode', () => {
    const inputText = getInputText({
      ...baseArgs,
      multiple: true,
      selected: options.slice(0, 1),
    });

    expect(inputText).toEqual('');
  });
});
