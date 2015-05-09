import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Sidebar from '../../src';
import MaterialTitlePanel from './material_title_panel';
import SidebarContent from './sidebar_content';

injectTapEventPlugin();

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
    return {
      docked: false,
      open: false,
      transitions: true,
      touch: true,
      touchDistance: 20,
      toggleDragDistance: 30,
    };
  },

  setOpen(open) {
    this.setState({open: open});
  },

  menuButtonClick(ev) {
    ev.preventDefault();
    this.setOpen(!this.state.open);
  },

  renderPropCheckbox(prop) {
    let toggleMethod = (ev) => {
      let newState = {};
      newState[prop] = ev.target.checked;
      this.setState(newState);
    };

    return (
      <p key={prop}>
        <input type='checkbox' onChange={toggleMethod} checked={this.state[prop]} id={prop} />
        <label htmlFor={prop}> {prop}</label>
      </p>);
  },

  renderPropNumber(prop) {
    let setMethod = (ev) => {
      let newState = {};
      newState[prop] = parseInt(ev.target.value);
      this.setState(newState);
    };

    return (
      <p key={prop}>
         {prop} <input type='number' onChange={setMethod} value={this.state[prop]} />
      </p>);
  },

  render() {
    let sidebar = <SidebarContent />;

    let contentHeader = (
      <span>
        {!this.state.docked &&
         <a onClick={this.menuButtonClick} href='#' style={styles.contentHeaderMenuLink}>=</a>}
        <span> React Sidebar</span>
      </span>);

    let sidebarProps = {
      sidebar: sidebar,
      docked: this.state.docked,
      open: this.state.open,
      transitions: this.state.transitions,
      setOpen: this.setOpen,
    };

    return (
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.content}>
            <p>React Sidebar is a sidebar component for React. It offers the following features:</p>
            <ul>
              <li>Slide over main content</li>
              <li>Dock sidebar on the left of the content</li>
              <li>Touch enabled: drag from the side to open the menu</li>
              <li>Easy to combine with media queries for auto-docking (<a href='responsive-example.html'>see example</a>)</li>
              <li>Sidebar and content passed in as PORCS (Plain Old React Components)</li>
            </ul>
            <p>Change properties below.</p>
            {['open', 'docked', 'transitions', 'touch'].map(this.renderPropCheckbox)}
            {['touchDistance', 'toggleDragDistance'].map(this.renderPropNumber)}
          </div>
        </MaterialTitlePanel>
      </Sidebar>
    );
  }
});

React.render(<App />, document.getElementById('example'))
