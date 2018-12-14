import React, { Children } from 'react';
import MyTreeNode from './TreeNode';

const convertDataToTree = treeData => {
  if (!treeData) return [];
  const list = Array.isArray(treeData) ? treeData : [treeData];
  return list.map(({ children, ...props }) => {
    const childrenNodes = convertDataToTree(children);
    return <MyTreeNode {...props}>{childrenNodes}</MyTreeNode>;
  });
};

const convertTreeToEntities = treeNodes => {
  const keyEntities = {};

  traverseTreeNodes(treeNodes, item => {
    const { node, index, key, parentKey } = item;
    const entity = { node, index, key };
    keyEntities[key] = entity;

    entity.parent = keyEntities[parentKey];
    if (entity.parent) {
      entity.parent.children = entity.parent.children || [];
      entity.parent.children.push(entity);
    }
  });

  return keyEntities;
};

const traverseTreeNodes = (treeNodes, callback) => {
  function processNode(node, index, parent) {
    const children = node ? node.props.children : treeNodes;

    if (node) {
      const data = {
        node,
        index,
        key: node.key,
        parentKey: parent.node && parent.node.key
      };
      callback(data);
    }

    Children.forEach(children, (subNode, subIndex) => {
      processNode(subNode, subIndex, { node });
    });
  }

  processNode(null);
};

const arrAdd = (list, value) => {
  const clone = list.slice();
  if (clone.indexOf(value) === -1) {
    clone.push(value);
  }
  return clone;
};

const arrDel = (list, value) => {
  const clone = list.slice();
  const index = clone.indexOf(value);
  if (index >= 0) {
    clone.splice(index, 1);
  }
  return clone;
};

const conductExpandParent = (keyList, keyEntities) => {
  const expandedKeys = {};
  function conductUp(key) {
    if (expandedKeys[key]) return;

    const entity = keyEntities[key];
    if (!entity) return;

    expandedKeys[key] = true;

    const { parent } = entity;

    if (parent) {
      conductUp(parent.key);
    }
  }

  (keyList || []).forEach(key => {
    conductUp(key);
  });

  return Object.keys(expandedKeys);
};

export {
  convertDataToTree,
  convertTreeToEntities,
  arrAdd,
  arrDel,
  conductExpandParent
};
