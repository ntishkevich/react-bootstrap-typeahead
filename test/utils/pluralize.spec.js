import {pluralize} from '../../src/utils';

describe('pluralize', () => {
  test('performs basic pluralization', () => {
    expect(pluralize('dog', 5)).toEqual('5 dogs');
  });

  test('does not pluralize for 1 item', () => {
    expect(pluralize('dog', 1)).toEqual('1 dog');
  });

  test('accepts custom pluralization', () => {
    expect(pluralize('radius', 2, 'radii')).toEqual('2 radii');
  });
});
