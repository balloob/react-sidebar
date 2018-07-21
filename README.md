React Sidebar 2.3 [![npm version](https://badge.fury.io/js/react-sidebar.svg)](http://badge.fury.io/js/react-sidebar) [![Build Status](https://travis-ci.org/balloob/react-sidebar.svg)](https://travis-ci.org/balloob/react-sidebar)
=============

React Sidebar is a sidebar component for React 0.14+. It offers the following features:

  - Have the sidebar slide over main content
  - Dock the sidebar on the left of the content
  - Touch enabled: swipe to open and close the sidebar
  - Easy to combine with media queries for auto-docking ([see example](http://balloob.github.io/react-sidebar/example/responsive_example.html))
  - Sidebar and content passed in as PORCs (Plain Old React Components)
  - MIT license
  - Only dependency is React.

[See a demo here.](http://balloob.github.io/react-sidebar/example/)

Change log
----------
## 2.3.2
 - prop-types is now a peer dependency (@Fallenstedt)

## 2.3.1
 - Modify content styles to have momentum scrolling (@Fallenstedt)
 - Update examples to eliminate depreciation warnings(@Fallenstedt)
 - Update readme's examples(@Fallenstedt)

## 2.3
 - Replace findDOMNode by ref callback (@BDav24)
 - Allow setting initial sidebar width (@BDav24)

## 2.2
 - Move from onTouchTap to onClick for React 15.2 compatibility (@factorize)
 - Fix accessibility issues (@cristian-sima)

## 2.1.4
 - Update included ES5 build with 2.1.3 changes

## 2.1.3
 - Added optional classNames (@sugarshin)

## 2.1.2
 - Fix server side rendering (@elliottsj)

## 2.1
 - Allow overriding embedded styles (@kulesa)

## 2.0.1
 - Allow adding className to sidebar using sidebarClassName prop (@lostdalek)

## 2.0.0
 - React 0.14 release

Touch specifics
---------------
The touch interaction of the React Sidebar mimics the interactions that are supported by Android apps that implement the material design spec:

 - When the sidebar is closed, dragging from the left side of the screen will have the right side of the sidebar follow your finger.
 - When the sidebar is open, sliding your finger over the screen will only affect the sidebar once your finger is over the sidebar.
 - On release, it will call `onSetOpen` prop if the distance the sidebar was dragged is more than the `dragToggleDistance` prop.

Supported props
---------------

| Property name | Type | Default | Description |
|---------------|------|---------|-------------|
| children | Anything React can render | n/a | The main content |
| rootClassName | string | n/a | Add a custom class to the root component |
| sidebarClassName | string | n/a | Add a custom class to the sidebar |
| contentClassName | string | n/a | Add a custom class to the content |
| overlayClassName | string | n/a | Add a custom class to the overlay |
| sidebar | Anything React can render | n/a | The sidebar content |
| onSetOpen | function | n/a | Callback called when the sidebar wants to change the open prop. Happens after sliding the sidebar and when the overlay is clicked when the sidebar is open. |
| docked | boolean | false | If the sidebar should be always visible |
| open | boolean | false | If the sidebar should be open |
| transitions | boolean | true | If transitions should be enabled |
| touch | boolean | true | If touch gestures should be enabled |
| touchHandleWidth | number | 20 | Width in pixels you can start dragging from the edge when the sidebar is closed. |
| dragToggleDistance | number | 30 | Distance the sidebar has to be dragged before it will open/close after it is released. |
| pullRight | boolean | false | Place the sidebar on the right |
| shadow | boolean | true | Enable/Disable sidebar shadow |
| styles | object | [See below](#styles) | Inline styles. These styles are merged with the defaults and applied to the respective elements. |

Installation
------------
React Sidebar is available on NPM. Install the package into your project: `npm install react-sidebar --save`

If you use TypeScript, typings are available on DefinitlyTyped and can be installed with: `npm install --save @types/react-sidebar`

Getting started
-----------------
By design, React Sidebar does not keep track of whether it is open or not. This has to be done by the parent component. This allows the parent component to make changes to the sidebar and main content based on the open/docked state. An example could be to hide the "show menu" button from the main content when the sidebar is docked.

Because React Sidebar can be toggled by dragging the sidebar into its open/closed position, you will have to pass in an `onSetOpen` method as a prop to allow the sidebar to control the open state in the parent.

The minimum React component to integrate React Sidebar looks like this:

```javascript
import React from 'react';
import Sidebar from 'react-sidebar';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebarOpen: false
    }

    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  onSetSidebarOpen: function(open) {
    this.setState({sidebarOpen: open});
  }

  render: function() {
    var sidebarContent = <b>Sidebar content</b>;

    return (
      <Sidebar sidebar={sidebarContent}
               open={this.state.sidebarOpen}
               onSetOpen={this.onSetSidebarOpen}>
        <b>Main content</b>
      </Sidebar>
    );
  }
};

export default App;
```

Responsive sidebar
------------------
A common use case for a sidebar is to show it automatically when there is enough screen width available. This can be achieved using media queries via [`window.matchMedia`][mdn-matchmedia]. This again has to be integrated into the parent component so you can use the information to make changes to the sidebar and main content.

[mdn-matchmedia]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia

```javascript
import React from 'react';
import Sidebar 'react-sidebar';

const mql = window.matchMedia(`(min-width: 800px)`);

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      mql: mql,
      docked: props.docked,
      open: props.open
    }

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  onSetSidebarOpen: function(open) {
    this.setState({sidebarOpen: open});
  }

  componentWillMount: function() {
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, sidebarDocked: mql.matches});
  }

  componentWillUnmount: function() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }

  mediaQueryChanged: function() {
    this.setState({sidebarDocked: this.state.mql.matches});
  }

  render: function() {
    var sidebarContent = <b>Sidebar content</b>;
    var sidebarProps = {
      sidebar: this.state.sidebarOpen,
      docked: this.state.sidebarDocked,
      onSetOpen: this.onSetSidebarOpen
    };

    return (
      <Sidebar sidebar={sidebarContent}
               open={this.state.sidebarOpen}
               docked={this.state.sidebarDocked}
               onSetOpen={this.onSetSidebarOpen}>
        <b>Main content</b>
      </Sidebar>
    );
  }
};

export default App;
```

Styles
----------------

Styles are passed as an object with 5 keys, `root`, `sidebar`, `content`, `overlay` and `dragHandle`, and merged to the defaults:

```javascript
{
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  sidebar: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    transition: 'transform .3s ease-out',
    WebkitTransition: '-webkit-transform .3s ease-out',
    willChange: 'transform',
    overflowY: 'auto',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    transition: 'left .3s ease-out, right .3s ease-out',
  },
  overlay: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity .3s ease-out, visibility .3s ease-out',
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  dragHandle: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    bottom: 0,
  },
};
```

Acknowledgements
----------------

My goal was to make a React Component that implements the [material design spec for navigation drawers](http://www.google.com/design/spec/patterns/navigation-drawer.html#navigation-drawer-content). My initial attempt was to improve [hamburger-basement by arnemart](https://github.com/arnemart/hamburger-basement) but I quickly figured that I better start from scratch. Still, that project helped me a ton to get started.
