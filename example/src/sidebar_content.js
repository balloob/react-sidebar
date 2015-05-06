import React from 'react/addons';
import MaterialTitlePanel from './material_title_panel';

const update = React.addons.update;

const styles = {
  sidebar: {
    width: 256,
    backgroundColor: 'white',
    height: '100%',
    transition: 'width 1s',
  },
  sidebarItem: {
    padding: '16px 0px',
    listStyle: 'none',
  },
  sidebarLink: {
    color: 'black',
  },
}

var SidebarContent = React.createClass({
  createMenuLink(href, caption) {
    return (
      <li key={href} style={styles.sidebarItem}>
        <a href={href} style={styles.sidebarLink}>
           {caption}
        </a>
      </li>);
  },

  render() {
    let style = styles.sidebar;

    if (this.props.style) {
      style = update(style, {$merge: this.props.style});
    }

    return (
      <MaterialTitlePanel title="Menu" style={style}>
        {this.createMenuLink('index.html', 'Property playground')}
        {this.createMenuLink('responsive_example.html', 'Responsive example')}
      </MaterialTitlePanel>);
  },
});

export default SidebarContent;
