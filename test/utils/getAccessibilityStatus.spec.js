import {getAccessibilityStatus} from '../../src/utils';

describe('getAccessibilityStatus', () => {
  it('displays the number of selections when the menu is hidden', () => {
    const selectionString = '0 selections';
    const status = getAccessibilityStatus({
      a11yNumSelected: () => selectionString,
      isMenuShown: false,
      results: [],
      selected: [],
    });
    expect(status).toEqual(selectionString);
  });

  it('displays the emptyLabel string when there are no results', () => {
    const emptyLabel = 'No results';
    const status = getAccessibilityStatus({
      emptyLabel,
      isMenuShown: true,
      results: [],
    });
    expect(status).toEqual(emptyLabel);
  });

  it('displays the number of results when the menu is shown', () => {
    const resultString = '1 result';
    const status = getAccessibilityStatus({
      a11yNumResults: () => resultString,
      isMenuShown: true,
      results: [1],
    });
    expect(status).toEqual(resultString);
  });
});
