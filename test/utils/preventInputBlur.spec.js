import {preventInputBlur} from '../../src/utils';

describe('preventInputBlur', () => {
  it('calls `preventDefault` on the event', () => {
    const e = {
      preventDefault: jest.fn(),
    };
    preventInputBlur(e);
    expect(e.preventDefault).toBeCalledTimes(1);
  });
});
