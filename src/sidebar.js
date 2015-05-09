import React from 'react/addons';

import TouchDragListener from './touch-drag-listener';

const update = React.addons.update;

const styles = {
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
    left: 0,
    bottom: 0,
    overflowX: 'hidden',
    transition: 'transform .3s ease-out',
    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.15)',
    transform: 'translateX(-100%)',
    willChange: 'transform',
    backgroundColor: 'white',
  },
  content: {
    flexGrow: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transition: 'left .3s ease-out',
  },
  overlay: {
    zIndex: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity .3s ease-out',
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  touchListener: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
};

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebarWidth: 0,
      dragging: false,
      dragX: 0,
    };

    this.overlayClicked = this.overlayClicked.bind(this);
    this.dragStartFilter = this.dragStartFilter.bind(this);
    this.onDrag = this.onDrag.bind(this);
  }

  overlayClicked() {
    this.props.setOpen(false);
  }

  componentDidMount() {
    this.saveSidebarWidth();
  }

  componentDidUpdate(prevState, prevProps) {
    // We only care about it if we're docked
    if (this.props.docked) {
      this.saveSidebarWidth();
    }
  }

  saveSidebarWidth() {
    let width = React.findDOMNode(this.refs.sidebar).offsetWidth;

    if (width != this.state.sidebarWidth) {
      this.setState({
        sidebarWidth: width,
      });
    }    
  }

  dragStartFilter(element, posX, posY) {
    return this.props.open && posX > this.state.sidebarWidth &&
           posX < this.state.sidebarWidth + this.props.toggleDragDistance ||
           !this.props.open && posX < this.props.toggleDragDistance;
  }

  onDrag(info) {
    let dragX = info.currentX - info.startX;

    if (info.end) {
      this.setState({dragging: false, dragX: 0});

      if (this.props.open && dragX < -this.props.toggleDragDistance ||
          !this.props.open && dragX > this.props.toggleDragDistance) {
        this.props.setOpen(!this.props.open);
        this.setState({dragging: false});
      }

      return;
    }

    this.setState({
      dragging: true,
      dragX: dragX,
    });
  }

  render() {
    let sidebarStyle = styles.sidebar,
        contentStyle = styles.content,
        overlayStyle = styles.overlay,
        overlay, children;

    if (this.state.dragging) {

      let percentage;

      if (this.props.open && this.state.dragX > 0) {
        percentage = 0;
      } else {
        percentage = Math.abs(this.state.dragX/this.state.sidebarWidth);

        if (!this.props.open) {
          percentage = 1-percentage;
        }        
      }

      // slide open to what we dragged
      sidebarStyle = update(sidebarStyle, {$merge: {
        transform: `translateX(-${percentage*100}%)`,
      }});

      // fade overlay to match distance of drag
      overlayStyle = update(overlayStyle, {$merge: {
        opacity: 1-percentage,
        visibility: 'visible',
      }});

    } else if (this.props.docked) {

      sidebarStyle = update(sidebarStyle, {$merge: {
        transform: `translateX(0%)`,
      }});

      // make space on the left size of the sidebar
      contentStyle = update(contentStyle, {$merge: {
        left: `${this.state.sidebarWidth}px`,
      }});

    } else if (this.props.open) {

      // slide open sidebar
      sidebarStyle = update(sidebarStyle, {$merge: {
        transform: `translateX(0%)`,
      }});

      // show overlay
      overlayStyle = update(overlayStyle, {$merge: {
        opacity: 1,
        visibility: 'visible',
      }});

    } else {

      // hide sidebar
      sidebarStyle = update(sidebarStyle, {$merge: {
        transform: `translateX(-100%)`,
      }});

    }

    if (this.state.dragging || !this.props.transitions) {
      sidebarStyle = update(sidebarStyle, {$merge: {
        transition: 'none',
      }});

      contentStyle = update(contentStyle, {$merge: {
        transition: 'none',
      }});

      overlayStyle = update(overlayStyle, {$merge: {
        transition: 'none',
      }});
    }

    return (
      <div style={styles.root}>
        <div style={sidebarStyle} ref='sidebar'>
          {this.props.sidebar}
        </div>
        <TouchDragListener style={contentStyle} onDrag={this.onDrag}
                           filter={this.dragStartFilter}>
          <div style={overlayStyle}
               onClick={this.overlayClicked} onTouchTap={this.overlayClicked} />
          {this.props.children}
        </TouchDragListener>
      </div>
    );
  }
};

Sidebar.propTypes = {
  // boolean if sidebar should be docked
  docked: React.PropTypes.bool,

  // boolean if sidebar should slide open
  open: React.PropTypes.bool,

  // boolean if transitions should be disabled
  transitions: React.PropTypes.bool,

  // boolean if touch gestures are enabled
  touch: React.PropTypes.bool,

  // max distance from the edge we can start dragging
  touchDistance: React.PropTypes.number,

  // how much we have to drag the sidebar to toggle open state
  toggleDragDistance: React.PropTypes.number,

  // callback called when the overlay is clicked
  setOpen: React.PropTypes.func,
};

Sidebar.defaultProps = {
  docked: false,
  open: false,
  transitions: true,
  touch: true,
  touchDistance: 20,
  toggleDragDistance: 30,
  setOpen: function() {},
};

export default Sidebar;
