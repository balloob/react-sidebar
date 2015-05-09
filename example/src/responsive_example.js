import React from 'react';
import Sidebar from '../../src';
import MaterialTitlePanel from './material_title_panel';
import SidebarContent from './sidebar_content';

const styles = {
  content: {
  },
  contentHeaderMenuLink: {
    textDecoration: 'none',
    color: 'white',
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

  setOpen(open) {
    this.setState({open: open});
  },

  componentDidMount() {
    this.setupMediaQuery();
  },

  componentWillUnmount() {
    this.destroyMediaQuery();
  },

  setupMediaQuery() {
    let mql = window.matchMedia(`(min-width: 800px)`);
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, docked: mql.matches});
  },

  destroyMediaQuery() {
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
      setOpen: this.setOpen,
    };

    return (
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <p>
            This example will show how to auto dock the sidebar if the page
            width is below 800px (which is currently {''+this.state.docked})
          </p>
        </MaterialTitlePanel>
      </Sidebar>
    );
  }
});

React.render(<App />, document.getElementById('example'))
