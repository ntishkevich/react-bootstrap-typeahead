import {getMatchBounds} from '../../src/utils';

describe('getMatchBounds', () => {
  it('handles a normal string', () => {
    const bounds = getMatchBounds('This is a string.', 'This is');

    expect(bounds.start).toEqual(0);
    expect(bounds.end).toEqual(7);
  });

  it('is case-insensitive', () => {
    const bounds = getMatchBounds('This String Has Caps.', 'string has');

    expect(bounds.start).toEqual(5);
    expect(bounds.end).toEqual(15);
  });

  it('handles diacritical marks in the search string', () => {
    const bounds = getMatchBounds('Schön ist, was schön lässt.', 'schö');

    expect(bounds.start).toEqual(0);
    expect(bounds.end).toEqual(4);
  });

  it('matches composed diacritical marks', () => {
    const bounds = getMatchBounds('Schön ist, was schön lässt.', 'was schon');

    expect(bounds.start).toEqual(11);
    expect(bounds.end).toEqual(20);
  });

  it('matches combined diacritical marks', () => {
    const bounds = getMatchBounds(
      'Scho\u0308n ist, was scho\u0308n la\u0308sst.',
      'was schon'
    );

    expect(bounds.start).toEqual(12);
    expect(bounds.end).toEqual(22);
  });
});
