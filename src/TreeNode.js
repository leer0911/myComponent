import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class MyTreeNode extends React.Component {
  static contextTypes = {
    onNodeExpand: PropTypes.func,
    renderTreeNode: PropTypes.func
  };
  renderChildren = children => {
    const { expanded } = this.props;
    const { renderTreeNode } = this.context;
    return expanded ? (
      <ul className="rc-child-tree">
        {children.map(child => {
          return renderTreeNode(child);
        })}
      </ul>
    ) : null;
  };
  onExpand = e => {
    const { onNodeExpand } = this.context;
    onNodeExpand(e, this);
  };
  renderSwitcher = () => {
    const { expanded, children } = this.props;

    if (children.length === 0) {
      return <span className="rc-tree-switcher rc-tree-switcher-noop" />;
    }

    const switcherCls = classNames(
      `rc-tree-switcher`,
      `rc-tree-switcher_${expanded ? 'open' : 'close'}`
    );
    return <span onClick={this.onExpand} className={switcherCls} />;
  };
  render() {
    const { title, children } = this.props;
    return (
      <li>
        {this.renderSwitcher()}
        {title}
        {this.renderChildren(children)}
      </li>
    );
  }
}
