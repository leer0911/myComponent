import React from 'react';

const convertDataToTree = treeData => {
  if (!treeData) return [];
  const list = Array.isArray(treeData) ? treeData : [treeData];
  return list.map(({ children, ...props }) => {
    const childrenNodes = convertDataToTree(children);
    return <MyTreeNode {...props}>{childrenNodes}</MyTreeNode>;
  });
};

export default class MyTree extends React.Component {
  state = {
    treeNode: []
  };
  static getDerivedStateFromProps(props, prevState) {
    const { treeData } = props;
    const newState = {
      prevProps: props,
      treeNode: convertDataToTree(treeData)
    };
    return newState;
  }
  render() {
    const { treeNode } = this.state;
    return <ul class="rc-tree">{treeNode}</ul>;
  }
}

class MyTreeNode extends React.Component {
  renderChildren = children => {
    return <ul className="rc-child-tree">{children}</ul>;
  };
  render() {
    const { title, children } = this.props;
    return (
      <li>
        {title}
        {this.renderChildren(children)}
      </li>
    );
  }
}
