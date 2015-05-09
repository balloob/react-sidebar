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
    transition: 'transform .3s ease-out',
    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.15)',
    transform: 'translateX(-100%)',
    willChange: 'transform',
    backgroundColor: 'white',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'scroll',
    transition: 'left .3s ease-out',
  },
  overlay: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity .3s ease-out',
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  dragHandle: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
  },
};

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // the detected width of the sidebar in pixels
      sidebarWidth: 0,

      // if we are currently dragging
      dragging: false,

      // the distance we dragged on the X-axis
      dragX: 0,

      // if touch is supported by the browser
      dragSupported: 'ontouchstart' in window,
    };

    this.overlayClicked = this.overlayClicked.bind(this);
    this.onDrag = this.onDrag.bind(this);
  }

  overlayClicked() {
    if (this.props.open) {
      this.props.setOpen(false);
    }
  }

  componentDidMount() {
    this.saveSidebarWidth();
  }

  componentDidUpdate(prevState, prevProps) {
    // filter out the updates when we're dragging
    if (!this.state.dragging) {
      this.saveSidebarWidth();
    }
  }

  saveSidebarWidth() {
    let width = React.findDOMNode(this.refs.sidebar).offsetWidth;

    if (width != this.state.sidebarWidth) {
      this.setState({sidebarWidth: width});
    }    
  }

  onDrag(info) {
    let dragX = info.currentX - info.startX;

    if (this.props.open) {
      // swiping on the overlay should only impact the sidebar once the finger
      // is over the sidebar
      dragX += info.startX - this.state.sidebarWidth;
    }

    if (info.end) {
      this.setState({dragging: false, dragX: 0});

      // if start position == end position, it was a tap on the drag handler
      // if sidebar is open, a tap will close the bar.
      let isTap = info.currentX == info.startX && info.currentY == info.startY;

      if (this.props.open && (isTap || dragX < -this.props.dragToggleDistance) ||
          !this.props.open && dragX > this.props.dragToggleDistance) {
        this.props.setOpen(!this.props.open);
        this.setState({dragging: false});
      }

      return;
    }

    this.setState({dragging: true, dragX: dragX});
  }

  render() {
    let sidebarStyle = styles.sidebar,
        contentStyle = styles.content,
        overlayStyle = styles.overlay,
        showDragHandle = this.state.dragSupported && this.props.touch && !this.props.docked,
        dragHandleStyle, overlay, children;

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

      // show sidebar
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

    if (showDragHandle) {
      if (this.props.open) {
        dragHandleStyle = update(styles.dragHandle, {$merge: {
          left: this.state.sidebarWidth,
          right: 0,
        }})
      } else {
        dragHandleStyle = update(styles.dragHandle, {$merge: {
          left: 0,
          width: this.props.dragHandleWidth,
        }})
      }
    }

    return (
      <div style={styles.root}>
        <div style={sidebarStyle} ref='sidebar'>
          {this.props.sidebar}
        </div>
        <div style={overlayStyle}
             onClick={this.overlayClicked} onTouchTap={this.overlayClicked} />
        <div style={contentStyle}>
          {showDragHandle &&
           <TouchDragListener onDrag={this.onDrag} style={dragHandleStyle} />}
          {this.props.children}
        </div>
      </div>
    );
  }
};

Sidebar.propTypes = {
  // main content to render
  children: React.PropTypes.node.isRequired,

  // sidebar content to render
  sidebar: React.PropTypes.node.isRequired,

  // boolean if sidebar should be docked
  docked: React.PropTypes.bool,

  // boolean if sidebar should slide open
  open: React.PropTypes.bool,

  // boolean if transitions should be disabled
  transitions: React.PropTypes.bool,

  // boolean if touch gestures are enabled
  touch: React.PropTypes.bool,

  // max distance from the edge we can start dragging
  dragHandleWidth: React.PropTypes.number,

  // distance we have to drag the sidebar to toggle open state
  dragToggleDistance: React.PropTypes.number,

  // callback called when the overlay is clicked
  setOpen: React.PropTypes.func,
};

Sidebar.defaultProps = {
  docked: false,
  open: false,
  transitions: true,
  touch: true,
  dragHandleWidth: 20,
  dragToggleDistance: 30,
  setOpen: function() {},
};

export default Sidebar;
