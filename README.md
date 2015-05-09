React Sidebar
=============

React Sidebar is a sidebar component for React. It offers the following features:

  - Slide over main content
  - Dock sidebar on the left of the content
  - Touch enabled: drag from the side to open the menu
  - Easy to combine with media queries for auto-docking (<a href='responsive_example.html'>see example</a>)
  - Sidebar and content passed in as PORCS (Plain Old React Components)
  - MIT license
  - Only dependency is React.

[See a demo here.](http://balloob.github.io/react-sidebar/example/)

Installation
------------
React Sidebar is available on NPM. Install the package into your project: `npm install react-sidebar --save`

Getting started
-----------------
React Sidebar does not keep track if it is open or not. This is done by the parent component. This is by design as it allows the parent component to make changes to the sidebar and main content based on the open/closed/docked state. An example could be to hide the "show menu" button from the main content when the sidebar is docked.

Because React Sidebar can be toggled by dragging the sidebar into its open/closed position, you will have to pass in a `setOpen` method into the sidebar to control the open state in the parent.

The minimum React component to integrate React Sidebar looks like this:

```javascript
import React from 'react';
import Sidebar from 'react-sidebar';

var App = React.createClass({
  getInitialState() {
    return {sidebarOpen: false};
  },

  setSidebarOpen(open) {
    this.setState({sidebarOpen: open});
  },

  render() {
    let sidebarContent = <b>Sidebar content</b>;

    return (
      <Sidebar sidebar={sidebarContent}
               open={this.state.sidebarOpen}
               setOpen={this.setSidebarOpen}>
        <b>Main content</b>
      </Sidebar>
    );
  }
});

export default App;
```

Responsive sidebar
------------------
A common usecase for a sidebar is to show it automatically when there is enough screen width available. This can be achieved using media queries. This again has to be integrated into the parent component so you can use the information to make changes to the sidebar and main content.

```javascript
import React from 'react';
import Sidebar from 'react-sidebar';

var App = React.createClass({
  getInitialState() {
    return {sidebarOpen: false, sidebarDocked: false};
  },

  setSidebarOpen(open) {
    this.setState({sidebarOpen: open});
  },

  componentWillMount() {
    let mql = window.matchMedia(`(min-width: 800px)`);
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, docked: mql.matches});
  },

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  },

  mediaQueryChanged() {
    this.setState({sidebarDocked: this.state.mql.matches});
  },

  render() {
    let sidebarContent = <b>Sidebar content</b>;

    return (
      <Sidebar sidebar={sidebarContent}
               open={this.state.sidebarOpen}
               docked={this.state.sidebarDocked}
               setOpen={this.setSidebarOpen}>
        <b>Main content</b>
      </Sidebar>
    );
  }
});

export default App;
```

Acknowledgements
----------------

My goal was to make a React Component that implements the [material design spec for navigation drawers](http://www.google.com/design/spec/patterns/navigation-drawer.html#navigation-drawer-content). My initial attempt was to improve [hamburger-basement by arnemart](https://github.com/arnemart/hamburger-basement) but I quickly figured that I better started from scratch. Still that project helped me a ton to get started.
