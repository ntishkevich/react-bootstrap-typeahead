import isSelectable from '../../src/utils/isSelectable';

describe('isSelectable', () => {
  it('identifies selectable elements', () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'text');
    expect(isSelectable(input)).toEqual(true);

    input.setAttribute('type', 'search');
    expect(isSelectable(input)).toEqual(true);

    input.setAttribute('type', 'password');
    expect(isSelectable(input)).toEqual(true);

    input.setAttribute('type', 'tel');
    expect(isSelectable(input)).toEqual(true);

    input.setAttribute('type', 'url');
    expect(isSelectable(input)).toEqual(true);

    const textarea = document.createElement('textarea');
    expect(isSelectable(textarea)).toEqual(true);
  });

  it('identifies non-selectable inputs', () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'email');
    expect(isSelectable(input)).toEqual(false);

    input.setAttribute('type', 'number');
    expect(isSelectable(input)).toEqual(false);

    const div = document.createElement('div');
    expect(isSelectable(div)).toEqual(false);
  });
});
