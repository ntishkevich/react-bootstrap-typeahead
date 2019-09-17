import {getMenuItemId} from '../../src/utils';

describe('getMenuItemId', () => {
  it('generates an id', () => {
    expect(getMenuItemId(0)).toEqual('rbt-menu-item-0');
  });
});
