import React from 'react';
import MQFacade from 'media-query-facade';
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
    return {
      docked: false,
      open: false,
    };
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
    var mq = new MQFacade();

    mq.on('only screen and (min-width: 800px)', () => this.setState({docked: true, open: false}));
    mq.on('only screen and (max-width: 800px)', () => this.setState({docked: false}));

    mq.on('only screen and (max-width: 600px)', () => this.setState({narrow: true}));
    mq.on('only screen and (min-width: 600px)', () => this.setState({narrow: false}));

    this.setState({mq: mq})
  },

  componentWillUnmount() {
    this.state.mq.off();
  },

  render() {
    let sidebarStyle = this.state.narrow ? {width: 150} : false;

    let sidebar = <SidebarContent style={sidebarStyle} />;

    let contentHeader = (
      <span>
        {!this.state.docked &&
         <a onClick={this.toggleOpen} href='#' style={styles.contentHeaderMenuLink}>=</a>}
        <span> React Sidebar responsive example</span>
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
          <p>The following media queries are active on this page:</p>
          <ol>
            <li>Dock the sidebar if width of page &gt; 800px - active: {''+this.state.docked}</li>
            <li>Reduce width of sidebar if page &lt; 600px - active: {''+this.state.narrow}</li>
          </ol>
        </MaterialTitlePanel>
      </Sidebar>
    );
  }
});

React.render(<App />, document.getElementById('example'))
