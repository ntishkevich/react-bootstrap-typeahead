// eslint-disable-next-line import/no-extraneous-dependencies
import Enzyme, {ReactWrapper} from 'enzyme';
// eslint-disable-next-line import/no-extraneous-dependencies
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

// TODO remove when enzyme releases https://github.com/airbnb/enzyme/pull/1179
ReactWrapper.prototype.hostNodes = function hostNodes() {
  return this.filterWhere((n) => typeof n.type() === 'string');
};

global.window.cancelAnimationFrame = function cancelAnimationFrame() { };

document.createRange = () => ({
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
  setEnd: () => {
  },
  setStart: () => {
  },
});
