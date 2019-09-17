import areEqual from '../../src/utils/areEqual';
import options from '../../example/exampleData';

const labelKey = 'name';

const customOne = {
  customOption: true,
  id: '0',
  [labelKey]: 'foo',
};

const customTwo = {
  customOption: true,
  id: '1',
  [labelKey]: 'foo',
};

const customThree = {
  customOption: true,
  id: '2',
  [labelKey]: 'bar',
};

describe('areEqual', () => {
  it('checks equality of the items', () => {
    expect(areEqual('foo', 'foo', labelKey)).toEqual(true);
    expect(areEqual('foo', 'bar', labelKey)).toEqual(false);

    expect(areEqual(options[0], options[0], labelKey)).toEqual(true);
    expect(areEqual(options[0], options[1], labelKey)).toEqual(false);

    expect(areEqual(customOne, customTwo, labelKey)).toEqual(true);
    expect(areEqual(customOne, customThree, labelKey)).toEqual(false);
  });
});
