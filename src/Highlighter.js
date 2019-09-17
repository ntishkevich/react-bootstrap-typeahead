import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {getMatchBounds} from './utils';

/**
 * Stripped-down version of https://github.com/helior/react-highlighter
 *
 * Results are already filtered by the time the component is used internally so
 * we can safely ignore case and diacritical marks for the purposes of matching.
 */
class Highlighter extends Component {
  _count = 0;

  renderHighlightedChildren() {
    const children = [];
    let remaining = this.props.children;

    while (remaining) {
      const bounds = getMatchBounds(remaining, this.props.search);

      if (!bounds) {
        this._count += 1;
        children.push(
          <span key={this._count}>
            {remaining}
          </span>
        );
        return children;
      }

      // Capture the string that leads up to a match...
      const nonMatch = remaining.slice(0, bounds.start);
      if (nonMatch) {
        this._count += 1;
        children.push(
          <span key={this._count}>
            {nonMatch}
          </span>
        );
      }

      // Now, capture the matching string...
      const match = remaining.slice(bounds.start, bounds.end);
      if (match) {
        this._count += 1;
        children.push(
          <mark className="rbt-highlight-text" key={this._count}>
            {match}
          </mark>
        );
      }

      // And if there's anything left over, continue the loop.
      remaining = remaining.slice(bounds.end);
    }

    return children;
  }

  render() {
    const {search, children: childArray} = this.props;
    const children = search ?
      this.renderHighlightedChildren() :
      childArray;

    return <span>{children}</span>;
  }
}

Highlighter.propTypes = {
  children: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
};

export default Highlighter;
