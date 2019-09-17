// In tests, polyfill requestAnimationFrame since jsdom doesn't provide it yet.
// We don't polyfill it in the browser
// eslint-disable-next-line import/no-extraneous-dependencies
require('raf').polyfill(global);
