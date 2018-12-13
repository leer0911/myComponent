# Tree 组件源码分析

## 项目运行

```bash
yarn start
```

## 关于树组件

给每一个节点设置一个独有的 `key`，在处理的过程将树节点扁平化。

例如，对于节点是否展开，可以用 `expandedKeys` 数组存当前展开节点的 `key` 值，而无需关心树形结构。

- expandedKeys
- selectedKeys
- checkedKeys
- loadedKeys

`Tree` 组件只用于处理数据，以及状态传递。

## 思路

先来看一个数据结构

```js
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
```

## 接着看 HTML 结构

```html
<ul role="tree" unselectable="on">
  <li role="treeitem">
    <span class="rc-tree-switcher"></span>
    <span class="rc-tree-checkbox"></span>
    <span title="parent 1" class="rc-tree-node-content-wrapper">
      <span class="rc-tree-iconEle"></span>
      <span class="rc-tree-title">parent 1</span>
    </span>
    <ul class="rc-tree-child-tree" data-expanded="true" role="group"></ul>
  </li>
</ul>
```

## css 控制类

```
.rc-tree-show-line
.rc-tree-treenode-switcher-open
```

## context 的使用

1. 父组件产生 `Context`，

- 父组件需要声明 `childContextTypes` 静态属性供子组件的 `Context` 对象属性使用;

- 实现一个 `getChildContext` 方法，并返回一个代表 `Context` 的纯对象。

```js
import React from 'react';
import PropTypes from 'prop-types';

class MiddleComponent extends React.Component {
  render() {
    return <ChildComponent />;
  }
}

class ParentComponent extends React.Component {
  // 声明Context对象属性
  static childContextTypes = {
    propA: PropTypes.string,
    methodA: PropTypes.func
  };

  // 返回 Context 对象，方法名是约定好的
  getChildContext() {
    return {
      propA: 'propA',
      methodA: () => 'methodA'
    };
  }

  render() {
    return <MiddleComponent />;
  }
}
```

2. 子组件使用 `Context`

- 子组件需要声明 `contextTypes` 后才能使用父组件 `Context` 对象;

```js
import React from 'react'
import PropTypes from 'prop-types'

class ChildComponent extends React.Component {
  // 声明需要使用的Context属性
  static contextTypes = {
    propA: PropTypes.string
  }

  render () {
    const {
      propA,
      methodA
    } = this.context

    console.log(`context.propA = ${propA}`)  // context.propA = propA
    console.log(`context.methodA = ${methodA}`)  // context.methodA = undefined

    return ...
  }
}
```

3. 无状态组件使用 `Context`

```js
import React from 'react'
import PropTypes from 'prop-types'

const ChildComponent = (props, context) => {
  // 函数第二个参数作为 context
  const {
    propA
  } = context

  console.log(`context.propA = ${propA}`)  // context.propA = propA

  return ...
}

ChildComponent.contextProps = {
  propA: PropTypes.string
}
```

4. 新版本使用 `Context`

[官方文档](https://reactjs.org/docs/context.html#reactcreatecontext)

通过 `React.createContext()` 静态方法创建一个 `context` 对象，这个 `Context` 对象包含两个组件

- `<Provider />`

- `<Consumer />`

```js
import React from 'react';
import ReactDOM from 'react-dom';

const ThemeContext = React.createContext({
  background: 'red',
  color: 'white'
});

class App extends React.Component {
  render() {
    return (
      <ThemeContext.Provider value={{ background: 'green', color: 'white' }}>
        <Header />
      </ThemeContext.Provider>
    );
  }
}
```

其中 `<Provider />` 的 `value` 相当于之前使用的 `getChildContext()`。

```js
class Header extends React.Component {
  render() {
    return <Title>Hello React Context API</Title>;
  }
}

class Title extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {context => (
          <h1 style={{ background: context.background, color: context.color }}>
            {this.props.children}
          </h1>
        )}
      </ThemeContext.Consumer>
    );
  }
}
```

**注意：** `<Consumer />` 的 `children` 必须是一个函数，函数的第一个参数是 `Context`

## getDerivedStateFromProps

每次接收新的 `props` 之后都会返回一个对象作为新的 `state`，返回 `null` 则说明不需要更新 `state`。

## cloneElement

```js
React.cloneElement(element, [props], [...children]);
```

> 以 element 作为起点，克隆并返回一个新的 React 元素(React Element)。生成的元素将会拥有原始元素 props 与新 props 的浅合并。新的子级会替换现有的子级。来自原始元素的 key 和 ref 将会保留。

React.cloneElement() 几乎相当于：

```js
<element.type {...element.props} {...props}>
  {children}
</element.type>
```
