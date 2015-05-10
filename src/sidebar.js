import React from 'react/addons';

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
    overflow: 'scroll',
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

      // keep track of touching params
      touchIdentifier: null,
      touchStartX: null,
      touchStartY: null,
      touchCurrentX: null,
      touchCurrentY: null,

      // if touch is supported by the browser
      dragSupported: 'ontouchstart' in window,
    };

    this.overlayClicked = this.overlayClicked.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

  }

  overlayClicked() {
    if (this.props.open) {
      this.props.onSetOpen(false);
    }
  }

  onTouchStart(ev) {
    // filter out if a user starts swiping with a second finger
    if (this.state.touchIdentifier === null) {
      let touch = ev.targetTouches[0];
      this.setState({
        touchIdentifier: touch.identifier,
        touchStartX: touch.clientX,
        touchStartY: touch.clientY,
        touchCurrentX: touch.clientX,
        touchCurrentY: touch.clientY,
      });      
    }
  }

  onTouchMove(ev) {
    if (window.a) {
      window.a++;
    } else {
      window.a = 1;
    }

    // if (window.a == 40) debugger;
    if (this.state.touchIdentifier !== null) {
      for (let i = 0; i < ev.targetTouches.length; i++) {
        // we only care about the finger that we are tracking
        if (ev.targetTouches[i].identifier == this.state.touchIdentifier) {
          this.setState({
            touchCurrentX: ev.targetTouches[i].clientX,
            touchCurrentY: ev.targetTouches[i].clientY,
          });
          break;
        }
      }
    }
  }

  onTouchEnd(ev) {
    if (this.state.touchIdentifier !== null) {
      // trigger a change to open if sidebar has been dragged beyond dragToggleDistance
      let touchWidth = this.touchSidebarWidth();

      if (this.props.open && touchWidth < this.state.sidebarWidth - this.props.dragToggleDistance ||
          !this.props.open && touchWidth > this.props.dragToggleDistance) {
        this.props.onSetOpen(!this.props.open);
      }

      this.setState({
        touchIdentifier: null,
        touchStartX: null,
        touchStartY: null,
        touchCurrentX: null,
        touchCurrentY: null,
      });
    }
  }

  componentDidMount() {
    this.saveSidebarWidth();
  }

  componentDidUpdate(prevState, prevProps) {
    // filter out the updates when we're touching
    if (this.state.touchIdentifier === null) {
      this.saveSidebarWidth();
    }
  }

  saveSidebarWidth() {
    let width = React.findDOMNode(this.refs.sidebar).offsetWidth;

    if (width != this.state.sidebarWidth) {
      this.setState({sidebarWidth: width});
    }    
  }

  // calculate the sidebarWidth based on current touch info
  touchSidebarWidth() {
    // if the sidebar is open and start point of drag is inside the sidebar
    // we will only drag the distance they moved their finger
    // otherwise we will move the sidebar to be below the finger.
    if (this.props.open && this.state.touchStartX < this.state.sidebarWidth) {
      if (this.state.touchCurrentX > this.state.touchStartX) {
        return this.state.sidebarWidth;
      } else {
        return this.state.sidebarWidth - this.state.touchStartX + this.state.touchCurrentX;
      }
    } else {
      return Math.min(this.state.touchCurrentX, this.state.sidebarWidth);
    }
  }

  render() {
    let sidebarStyle = styles.sidebar,
        contentStyle = styles.content,
        overlayStyle = styles.overlay,
        showDragHandle = this.state.dragSupported && this.props.touch &&
                         !this.props.docked && !this.props.open,
        dragHandleStyle, overlay, children;

    if (this.state.touchIdentifier !== null) {

      let percentage = this.touchSidebarWidth() / this.state.sidebarWidth;

      // slide open to what we dragged
      sidebarStyle = update(sidebarStyle, {$merge: {
        transform: `translateX(-${(1-percentage)*100}%)`,
      }});

      // fade overlay to match distance of drag
      overlayStyle = update(overlayStyle, {$merge: {
        opacity: percentage,
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

    if (this.state.touchIdentifier !== null || !this.props.transitions) {
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

    if(showDragHandle) {
      dragHandleStyle = update(styles.dragHandle, {$merge: {
        width: this.props.touchHandleWidth,
      }})
    }

    let rootProps = {
      style: styles.root,
    }

    if (this.props.open) {
      rootProps.onTouchStart = this.onTouchStart;
      rootProps.onTouchMove = this.onTouchMove;
      rootProps.onTouchEnd = this.onTouchEnd;
      rootProps.onTouchCancel = this.onTouchEnd;
    }

    return (
      <div {...rootProps}>
        <div style={sidebarStyle} ref='sidebar'>
          {this.props.sidebar}
        </div>
        <div style={overlayStyle}
             onClick={this.overlayClicked} onTouchTap={this.overlayClicked} />
        <div style={contentStyle}>
          {showDragHandle &&
           <div style={dragHandleStyle}
                onTouchStart={this.onTouchStart} onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd} onTouchCancel={this.onTouchEnd} />}
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

  // max distance from the edge we can start touching
  touchHandleWidth: React.PropTypes.number,

  // distance we have to drag the sidebar to toggle open state
  dragToggleDistance: React.PropTypes.number,

  // callback called when the overlay is clicked
  onSetOpen: React.PropTypes.func,
};

Sidebar.defaultProps = {
  docked: false,
  open: false,
  transitions: true,
  touch: true,
  touchHandleWidth: 20,
  dragToggleDistance: 30,
  onSetOpen: function() {},
};

export default Sidebar;
