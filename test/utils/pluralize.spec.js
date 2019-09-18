import {pluralize} from '../../src/utils';

describe('pluralize', () => {
  it('performs basic pluralization', () => {
    expect(pluralize('dog', 5)).toEqual('5 dogs');
  });

  it('does not pluralize for 1 item', () => {
    expect(pluralize('dog', 1)).toEqual('1 dog');
  });

  it('accepts custom pluralization', () => {
    expect(pluralize('radius', 2, 'radii')).toEqual('2 radii');
  });
});
