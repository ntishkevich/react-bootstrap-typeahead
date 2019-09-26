import isSelectable from '../../src/utils/isSelectable';

describe('isSelectable', () => {
  test('identifies selectable elements', () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'text');
    expect(isSelectable(input)).toBe(true);

    input.setAttribute('type', 'search');
    expect(isSelectable(input)).toBe(true);

    input.setAttribute('type', 'password');
    expect(isSelectable(input)).toBe(true);

    input.setAttribute('type', 'tel');
    expect(isSelectable(input)).toBe(true);

    input.setAttribute('type', 'url');
    expect(isSelectable(input)).toBe(true);

    // todo textarea isn't selectable in jsodm, wtf?!
    // const textarea = document.createElement('textarea');
    // expect(isSelectable(textarea)).toBe(true);
  });

  test('identifies non-selectable inputs', () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'email');
    expect(isSelectable(input)).toBe(false);

    input.setAttribute('type', 'number');
    expect(isSelectable(input)).toBe(false);

    const div = document.createElement('div');
    expect(isSelectable(div)).toBe(false);
  });
});
