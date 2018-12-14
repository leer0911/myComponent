import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Tree, { TreeNode } from '../rc-tree';
import MyTree from '../src/Tree';
import './demo.less';

const treeData = [
  {
    key: '0-0',
    title: 'parent 1',
    children: [
      {
        key: '0-0-0',
        title: 'parent 1-1',
        children: [{ key: '0-0-0-0', title: 'parent 1-1-0' }]
      },
      {
        key: '0-0-1',
        title: 'parent 1-2',
        children: [
          { key: '0-0-1-0', title: 'parent 1-2-0', disableCheckbox: true },
          { key: '0-0-1-1', title: 'parent 1-2-1' }
        ]
      }
    ]
  }
];

class Demo extends React.Component {
  static propTypes = {
    keys: PropTypes.array
  };
  static defaultProps = {
    keys: ['0-0-1']
  };
  constructor(props) {
    super(props);
    const keys = props.keys;
    this.state = {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys
    };
  }
  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
  };
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    this.selKey = info.node.props.eventKey;
  };
  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };
  onDragStart = e => {
    console.log(e);
  };
  render() {
    return (
      <div style={{ margin: '0 20px' }}>
        <h2>my-tree</h2>

        <MyTree
          treeData={treeData}
          defaultExpandParent
          defaultExpandedKeys={this.state.defaultExpandedKeys}
        />

        <h2>rc-tree</h2>
        <Tree
          className="myCls"
          showLine
          checkable
          selectable={false}
          draggable
          onExpand={this.onExpand}
          defaultExpandedKeys={this.state.defaultExpandedKeys}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          onDragStart={this.onDragStart}
          treeData={treeData}
        />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('app'));
