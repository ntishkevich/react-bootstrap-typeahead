import {mount, shallow} from 'enzyme';
import React from 'react';
import {Popper} from 'react-popper';

import Menu from '../../src/Menu.react';
import Overlay from '../../src/Overlay';

describe('<Overlay>', () => {
  describe('shallow behaviors', () => {
    let wrapper;
    beforeEach(() => {
      const div = document.createElement('div');
      wrapper = shallow(
        <Overlay
          container={div}
          referenceElement={div}
          show={false}>
          <div>This is the menu</div>
        </Overlay>
      );
    });

    it('returns `null` when `show=false`', () => {
      expect(wrapper).toHaveLength(1);
      expect(wrapper.type()).toBeNull();
    });

    it('renders a PopperJs when `show=true`', () => {
      wrapper.setProps({show: true});
      expect(wrapper.children().type()).toEqual(Popper);
    });

    it('returns `null` when child is `null`', () => {
      wrapper.setProps({children: null, show: true});
      expect(wrapper).toHaveLength(1);
      expect(wrapper.type()).toBeNull();
    });

    it('throws when multiple children are passed', () => {
      const willThrow = () => {
        wrapper.setProps({
          children: [<div key="1" />, <div key="2" />],
          show: true,
        });
      };

      expect(willThrow).toThrowError(Error);
    });

    describe('menu visibility hooks', () => {
      it('calls `onMenuShow`', () => {
        const onMenuShow = jest.fn();

        wrapper.setProps({onMenuShow});

        expect(onMenuShow).toHaveBeenCalledTimes(0);

        wrapper.setProps({show: true});
        expect(onMenuShow).toHaveBeenCalledTimes(1);

        // Shouldn't be called again if not hidden first.
        wrapper.setProps({show: true});
        expect(onMenuShow).toHaveBeenCalledTimes(1);
      });

      it('calls `onMenuHide`', () => {
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

      it('calls `onMenuToggle`', () => {
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

    it('renders a PopperJs when `show=true`', () => {
      expect(wrapper.find('.rbt-menu').text()).toEqual('This is the menu');
    });

    it('is attached to `div`', () => {
      expect(document.body.childNodes).toHaveLength(BASE_NODE_COUNT + 1);
      expect(div.childNodes).toHaveLength(1);
    });

    it('is attached to `document.body`', () => {
      wrapper.setProps({container: document.body});

      expect(document.body.childNodes).toHaveLength(BASE_NODE_COUNT + 2);
      expect(div.childNodes).toHaveLength(0);
    });
  });
});
