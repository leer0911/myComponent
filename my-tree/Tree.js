import React from 'react';
import PropTypes from 'prop-types';
import {
  convertDataToTree,
  convertTreeToEntities,
  arrAdd,
  arrDel,
  conductExpandParent
} from './util';

export default class MyTree extends React.Component {
  static propTypes = {
    autoExpandParent: PropTypes.bool,
    defaultExpandAll: PropTypes.bool,
    defaultExpandParent: PropTypes.bool,
    defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string)
  };

  state = {
    treeNode: [],
    expandedKeys: []
  };
  static childContextTypes = {
    onNodeExpand: PropTypes.func,
    renderTreeNode: PropTypes.func
  };
  getChildContext() {
    return {
      onNodeExpand: this.onNodeExpand,
      renderTreeNode: this.renderTreeNode
    };
  }
  static getDerivedStateFromProps(props, prevState) {
    const { treeData } = props;
    const { prevProps } = prevState;
    function needSync(name) {
      return (
        (!prevProps && name in props) ||
        (prevProps && prevProps[name] !== props[name])
      );
    }

    let treeNode = null;
    treeNode = convertDataToTree(treeData);

    const newState = {
      prevProps: props,
      treeNode
    };

    if (treeNode) {
      newState.treeNode = treeNode;

      // Calculate the entities data for quick match
      const entities = convertTreeToEntities(treeNode);
      newState.keyEntities = entities;
    }

    const keyEntities = newState.keyEntities || prevState.keyEntities;

    // ================ expandedKeys =================
    const {
      defaultExpandAll,
      defaultExpandedKeys,
      autoExpandParent,
      defaultExpandParent
    } = props;
    const isFirstRender = !prevProps;
    const isExpandAll = isFirstRender && defaultExpandAll;
    const hasDefaultExpandedKeys = isFirstRender && defaultExpandedKeys;

    if (
      needSync('expandedKeys') ||
      (prevProps && needSync('autoExpandParent'))
    ) {
      newState.expandedKeys =
        autoExpandParent || (!prevProps && defaultExpandParent)
          ? conductExpandParent(expandedKeys, keyEntities)
          : expandedKeys;
    } else if (isExpandAll) {
      newState.expandedKeys = Object.keys(keyEntities);
    } else if (hasDefaultExpandedKeys) {
      newState.expandedKeys =
        autoExpandParent || defaultExpandParent
          ? conductExpandParent(defaultExpandedKeys, keyEntities)
          : defaultExpandedKeys;
    }

    return newState;
  }
  onNodeExpand = (e, treeNode) => {
    let { expandedKeys } = this.state;
    const { expanded, eventKey } = treeNode.props;
    const targetExpanded = !expanded;

    if (targetExpanded) {
      expandedKeys = arrAdd(expandedKeys, eventKey);
    } else {
      expandedKeys = arrDel(expandedKeys, eventKey);
    }
    this.setUncontrolledState({ expandedKeys });
  };
  setUncontrolledState = state => {
    let needSync = false;
    const newState = {};

    Object.keys(state).forEach(name => {
      if (name in this.props) return;

      needSync = true;
      newState[name] = state[name];
    });

    if (needSync) {
      this.setState(newState);
    }
  };
  renderTreeNode = child => {
    const { expandedKeys = [] } = this.state;
    const key = child.key || pos;
    return React.cloneElement(child, {
      key,
      eventKey: key,
      expanded: expandedKeys.indexOf(key) !== -1
    });
  };
  render() {
    const { treeNode } = this.state;
    return (
      <ul className="rc-tree">
        {treeNode.map(child => {
          return this.renderTreeNode(child);
        })}
      </ul>
    );
  }
}
