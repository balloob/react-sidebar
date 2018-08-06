import React from "react";
import ReactDOM from "react-dom";
import Sidebar from "../..";
import MaterialTitlePanel from "./material_title_panel";
import SidebarContent from "./sidebar_content";

const styles = {
  contentHeaderMenuLink: {
    textDecoration: "none",
    color: "white",
    padding: 8
  },
  content: {
    padding: "16px"
  }
};

const mql = window.matchMedia(`(min-width: 800px)`);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      docked: mql.matches,
      open: false
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.onSetOpen = this.onSetOpen.bind(this);
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  onSetOpen(open) {
    this.setState({ open });
  }

  mediaQueryChanged() {
    this.setState({
      docked: mql.matches,
      open: false
    });
  }

  toggleOpen(ev) {
    this.setState({ open: !this.state.open });

    if (ev) {
      ev.preventDefault();
    }
  }

  render() {
    const sidebar = <SidebarContent />;

    const contentHeader = (
      <span>
        {!this.state.docked && (
          <a
            onClick={this.toggleOpen}
            href="#"
            style={styles.contentHeaderMenuLink}
          >
            =
          </a>
        )}
        <span> Responsive React Sidebar</span>
      </span>
    );

    const sidebarProps = {
      sidebar,
      docked: this.state.docked,
      open: this.state.open,
      onSetOpen: this.onSetOpen
    };

    return (
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
          <div style={styles.content}>
            <p>
              This example will automatically dock the sidebar if the page width
              is above 800px (which is currently {this.state.docked.toString()}
              ).
            </p>
            <p>
              This functionality should live in the component that renders the
              sidebar. This way you&#39;re able to modify the sidebar and main
              content based on the responsiveness data. For example, the menu
              button in the header of the content is now{" "}
              {this.state.docked ? "hidden" : "shown"} because the sidebar is{" "}
              {!this.state.docked && "not"} visible.
            </p>
          </div>
        </MaterialTitlePanel>
      </Sidebar>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("example"));
