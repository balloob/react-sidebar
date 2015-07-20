React Sidebar [![npm version](https://badge.fury.io/js/react-sidebar.svg)](http://badge.fury.io/js/react-sidebar)
=============

React Sidebar is a sidebar component for React. It offers the following features:

  - Have the sidebar slide over main content
  - Dock the sidebar on the left of the content
  - Touch enabled: swipe to open and close the sidebar
  - Easy to combine with media queries for auto-docking ([see example](http://balloob.github.io/react-sidebar/example/responsive_example.html))
  - Sidebar and content passed in as PORCs (Plain Old React Components)
  - MIT license
  - Only dependency is React.

[See a demo here.](http://balloob.github.io/react-sidebar/example/)

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

Installation
------------
React Sidebar is available on NPM. Install the package into your project: `npm install react-sidebar --save`

Getting started
-----------------
By design, React Sidebar does not keep track of whether it is open or not. This has to be done by the parent component. This allows the parent component to make changes to the sidebar and main content based on the open/docked state. An example could be to hide the "show menu" button from the main content when the sidebar is docked.

Because React Sidebar can be toggled by dragging the sidebar into its open/closed position, you will have to pass in an `onSetOpen` method as a prop to allow the sidebar to control the open state in the parent.

The minimum React component to integrate React Sidebar looks like this:

```javascript
var React = require('react');
var Sidebar = require('react-sidebar');

var App = React.createClass({
  getInitialState: function() {
    return {sidebarOpen: false};
  },

  onSetSidebarOpen: function(open) {
    this.setState({sidebarOpen: open});
  },

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
});

module.exports = App;
```

Responsive sidebar
------------------
A common use case for a sidebar is to show it automatically when there is enough screen width available. This can be achieved using media queries via [`window.matchMedia`][mdn-matchmedia]. This again has to be integrated into the parent component so you can use the information to make changes to the sidebar and main content.

[mdn-matchmedia]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia

```javascript
var React = require('react');
var Sidebar = require('react-sidebar');

var App = React.createClass({
  getInitialState() {
    return {sidebarOpen: false, sidebarDocked: false};
  },

  onSetSidebarOpen: function(open) {
    this.setState({sidebarOpen: open});
  },

  componentWillMount: function() {
    var mql = window.matchMedia(`(min-width: 800px)`);
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, docked: mql.matches});
  },

  componentWillUnmount: function() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  },

  mediaQueryChanged: function() {
    this.setState({sidebarDocked: this.state.mql.matches});
  },

  render: function() {
    var sidebarContent = <b>Sidebar content</b>;

    return (
      <Sidebar sidebar={sidebarContent}
               open={this.state.sidebarOpen}
               docked={this.state.sidebarDocked}
               onSetOpen={this.onSetSidebarOpen}>
        <b>Main content</b>
      </Sidebar>
    );
  }
});

module.exports = App;
```

Acknowledgements
----------------

My goal was to make a React Component that implements the [material design spec for navigation drawers](http://www.google.com/design/spec/patterns/navigation-drawer.html#navigation-drawer-content). My initial attempt was to improve [hamburger-basement by arnemart](https://github.com/arnemart/hamburger-basement) but I quickly figured that I better start from scratch. Still, that project helped me a ton to get started.
