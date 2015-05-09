import React from 'react';
import Sidebar from '../../src';
import MaterialTitlePanel from './material_title_panel';
import SidebarContent from './sidebar_content';

const styles = {
  contentHeaderMenuLink: {
    textDecoration: 'none',
    color: 'white',
    padding: 8,
  },
};

var App = React.createClass({
  getInitialState() {
    return {docked: false, open: false};
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
  },

  toggleOpen(ev) {
    this.setState({open: !this.state.open});

    if (ev) {
      ev.preventDefault();
    }
  },

  onSetOpen(open) {
    this.setState({open: open});
  },

  componentDidMount() {
    let mql = window.matchMedia(`(min-width: 800px)`);
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, docked: mql.matches});
  },

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  },

  mediaQueryChanged() {
    this.setState({docked: this.state.mql.matches});
  },

  render() {
    let sidebar = <SidebarContent />;

    let contentHeader = (
      <span>
        {!this.state.docked &&
         <a onClick={this.toggleOpen} href='#' style={styles.contentHeaderMenuLink}>=</a>}
        <span> Responsive React Sidebar</span>
      </span>);

    let sidebarProps = {
      sidebar: sidebar,
      docked: this.state.docked,
      open: this.state.open,
      onSetOpen: this.onSetOpen,
    };

    return (
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <p>
            This example will automatically dock the sidebar if the page
            width is above 800px (which is currently {''+this.state.docked}).
          </p>
          <p>
            This functionality should live in the component that renders the sidebar.
            This way you're able to modify the sidebar and main content based on the
            responsiveness data. For example, the menu button in the header of the
            content is now {this.state.docked ? 'hidden' : 'shown'} because the sidebar
            is {!this.state.docked && 'not'} visible.
          </p>
        </MaterialTitlePanel>
      </Sidebar>
    );
  }
});

React.render(<App />, document.getElementById('example'))
