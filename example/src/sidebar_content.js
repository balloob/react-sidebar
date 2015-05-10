import React from 'react/addons';
import MaterialTitlePanel from './material_title_panel';

const update = React.addons.update;

const styles = {
  sidebar: {
    width: 256,
  },
  sidebarLink: {
    display: 'block',
    padding: '16px 0px',
    color: '#757575',
    textDecoration: 'none',
  },
  divider: {
    margin: '8px 0',
    height: 1,
    backgroundColor: '#757575',
  },
};

var SidebarContent = React.createClass({
  render() {
    let style = styles.sidebar;

    if (this.props.style) {
      style = update(style, {$merge: this.props.style});
    }

    let links = [];

    for(let i=0; i < 10; i++) {
      links.push(
        <a key={i} href='#' style={styles.sidebarLink}>Mock menu item {i}</a>);
    }

    return (
      <MaterialTitlePanel title="Menu" style={style}>
        <a href='index.html' style={styles.sidebarLink}>Home</a>
        <a href='responsive_example.html' style={styles.sidebarLink}>Responsive Example</a>
        <div style={styles.divider} />
        {links}
      </MaterialTitlePanel>);
  },
});

export default SidebarContent;
