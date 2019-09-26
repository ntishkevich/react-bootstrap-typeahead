import {getMenuItemId} from '../../src/utils';

describe('getMenuItemId', () => {
  test('generates an id', () => {
    expect(getMenuItemId(0)).toEqual('rbt-menu-item-0');
  });
});
