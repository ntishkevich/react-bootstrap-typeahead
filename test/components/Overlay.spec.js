import React from 'react';
import {Popper} from 'react-popper';
import {render, cleanup, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Menu from '../../src/Menu';
import Overlay from '../../src/Overlay';

describe.skip('<Overlay>', () => {
  describe('shallow behaviors', () => {

    afterEach(cleanup);

    test('returns `null` when `show=false`', () => {
      const {container} = render(
        <Overlay
          container={div}
          referenceElement={div}
          show={false}>
          <div>This is the menu</div>
        </Overlay>
      );

      expect(wrapper).toHaveLength(1);
      expect(wrapper.type()).toBeNull();
    });

    test('renders a PopperJs when `show=true`', () => {
      wrapper.setProps({show: true});
      expect(wrapper.children().type()).toEqual(Popper);
    });

    test('returns `null` when child is `null`', () => {
      wrapper.setProps({children: null, show: true});
      expect(wrapper).toHaveLength(1);
      expect(wrapper.type()).toBeNull();
    });

    test('throws when multiple children are passed', () => {
      const willThrow = () => {
        wrapper.setProps({
          children: [<div key="1" />, <div key="2" />],
          show: true,
        });
      };

      expect(willThrow).toThrowError(Error);
    });

    describe('menu visibility hooks', () => {
      test('calls `onMenuShow`', () => {
        const onMenuShow = jest.fn();

        wrapper.setProps({onMenuShow});

        expect(onMenuShow).toHaveBeenCalledTimes(0);

        wrapper.setProps({show: true});
        expect(onMenuShow).toHaveBeenCalledTimes(1);

        // Shouldn't be called again if not hidden first.
        wrapper.setProps({show: true});
        expect(onMenuShow).toHaveBeenCalledTimes(1);
      });

      test('calls `onMenuHide`', () => {
        const onMenuHide = jest.fn();

        wrapper.setProps({
          onMenuHide,
          show: true,
        });

        expect(onMenuHide).not.toHaveBeenCalled();

        wrapper.setProps({show: false});
        expect(onMenuHide).toHaveBeenCalledTimes(1);

        // Shouldn't be called again if not shown first.
        wrapper.setProps({show: false});
        expect(onMenuHide).toHaveBeenCalledTimes(1);
      });

      test('calls `onMenuToggle`', () => {
        const onMenuToggle = jest.fn();

        wrapper.setProps({onMenuToggle});

        expect(onMenuToggle).not.toHaveBeenCalled();

        wrapper.setProps({show: true});
        expect(onMenuToggle).toHaveBeenCalledTimes(1);

        // Shouldn't be called again if not hidden first.
        wrapper.setProps({show: true});
        expect(onMenuToggle).toHaveBeenCalledTimes(1);

        wrapper.setProps({show: false});
        expect(onMenuToggle).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('mounted behaviors', () => {
    let BASE_NODE_COUNT, div, wrapper;

    beforeEach(() => {
      // Karma adds a bunch of extra nodes to the body.
      BASE_NODE_COUNT = document.body.childNodes.length;

      div = document.createElement('div');
      document.body.appendChild(div);

      wrapper = mount(
        <Overlay
          container={div}
          referenceElement={div}
          show>
          <Menu id="menu-id">
            This is the menu
          </Menu>
        </Overlay>,
        {attachTo: div}
      );
    });

    afterEach(() => {
      wrapper.detach();
    });

    test('renders a PopperJs when `show=true`', () => {
      expect(wrapper.find('.rbt-menu').text()).toEqual('This is the menu');
    });

    test('is attached to `div`', () => {
      expect(document.body.childNodes).toHaveLength(BASE_NODE_COUNT + 1);
      expect(div.childNodes).toHaveLength(1);
    });

    test('is attached to `document.body`', () => {
      wrapper.setProps({container: document.body});

      expect(document.body.childNodes).toHaveLength(BASE_NODE_COUNT + 2);
      expect(div.childNodes).toHaveLength(0);
    });
  });
});
