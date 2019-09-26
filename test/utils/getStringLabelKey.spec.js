import getStringLabelKey from '../../src/utils/getStringLabelKey';

describe('getStringLabelKey', () => {
  test('returns the specified string labelKey', () => {
    expect(getStringLabelKey('name')).toEqual('name');
  });

  test('returns the default labelKey when `labelKey` is a function', () => {
    expect(getStringLabelKey((o) => o.name)).toEqual('label');
  });
});
