import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

const CANCEL_DISTANCE_ON_SCROLL = 20;
const defaultStyles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  },
  sidebar: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    transition: 'transform .3s ease-out',
    WebkitTransition: '-webkit-transform .3s ease-out',
    willChange: 'transform',
    overflowY: 'auto'
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    transition: 'left .3s ease-out, right .3s ease-out'
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
    transition: 'opacity .3s ease-out, visibility .3s ease-out',
    backgroundColor: 'rgba(0,0,0,.3)'
  },
  dragHandle: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    bottom: 0
  }
};

const Sidebar = props => {
  // the detected width of the sidebar in pixels
  const [sidebarWidth, setSidebarWidth] = useState(props.defaultSidebarWidth);

  // keep track of touching params
  const [touchParams, setTouchParams] = useState({
    identifier: null,
    startX: null,
    currentX: null
  });

  // if touch is supported by the browser
  const [dragSupported, setDragSupported] = useState(false);

  const sidebarRef = useRef();

  useEffect(() => {
    const isIos = /iPad|iPhone|iPod/.test(navigator ? navigator.userAgent : '');
    setDragSupported(
      typeof window === 'object' && 'ontouchstart' in window && !isIos
    );
    saveSidebarWidth();
  }, []);

  useEffect(() => {
    // filter out the updates when we're touching
    if (!isTouching()) {
      saveSidebarWidth();
    }
  });

  const onTouchStart = ev => {
    // filter out if a user starts swiping with a second finger
    if (!isTouching()) {
      const { identifier, clientX } = ev.targetTouches[0];

      setTouchParams({
        identifier: identifier,
        startX: clientX,
        currentX: clientX
      });
    }
  };

  const onTouchMove = ev => {
    if (isTouching()) {
      for (let ind = 0; ind < ev.targetTouches.length; ind++) {
        // we only care about the finger that we are tracking
        if (ev.targetTouches[ind].identifier === touchParams.identifier) {
          setTouchParams({
            ...touchParams,
            currentX: ev.targetTouches[ind].clientX
          });
          break;
        }
      }
    }
  };

  const onTouchEnd = () => {
    if (isTouching()) {
      // trigger a change to open if sidebar has been dragged beyond dragToggleDistance
      const touchWidth = touchSidebarWidth();

      if (
        (props.open && touchWidth < sidebarWidth - props.dragToggleDistance) ||
        (!props.open && touchWidth > props.dragToggleDistance)
      ) {
        props.onSetOpen(!props.open);
      }

      setTouchParams({
        identifier: null,
        startX: null,
        currentX: null
      });
    }
  };

  // This logic helps us prevents the user from sliding the sidebar horizontally
  // while scrolling the sidebar vertically. When a scroll event comes in, we're
  // cancelling the ongoing gesture if it did not move horizontally much.
  const onScroll = () => {
    if (isTouching() && inCancelDistanceOnScroll()) {
      setTouchParams({
        identifier: null,
        startX: null,
        currentX: null
      });
    }
  };

  // True if the on going gesture X distance is less than the cancel distance
  const inCancelDistanceOnScroll = () => {
    let cancelDistanceOnScroll;

    if (props.pullRight) {
      cancelDistanceOnScroll =
        Math.abs(touchParams.currentX - touchParams.startX) <
        CANCEL_DISTANCE_ON_SCROLL;
    } else {
      cancelDistanceOnScroll =
        Math.abs(touchParams.startX - touchParams.currentX) <
        CANCEL_DISTANCE_ON_SCROLL;
    }
    return cancelDistanceOnScroll;
  };

  const isTouching = () => {
    return touchParams.identifier !== null;
  };

  const overlayClicked = () => {
    if (props.open) {
      props.onSetOpen(false);
    }
  };

  const saveSidebarWidth = () => {
    const width = sidebarRef.current.offsetWidth;

    if (width !== sidebarWidth) {
      setSidebarWidth(width);
    }
  };

  const saveSidebarRef = node => {
    sidebarRef.current = node;
  };

  // calculate the sidebarWidth based on current touch info
  const touchSidebarWidth = () => {
    // if the sidebar is open and start point of drag is inside the sidebar
    // we will only drag the distance they moved their finger
    // otherwise we will move the sidebar to be below the finger.
    if (props.pullRight) {
      if (props.open && window.innerWidth - touchParams.startX < sidebarWidth) {
        if (touchParams.currentX > touchParams.startX) {
          return sidebarWidth + touchParams.startX - touchParams.currentX;
        }
        return sidebarWidth;
      }
      return Math.min(window.innerWidth - touchParams.currentX, sidebarWidth);
    }

    if (props.open && touchParams.startX < sidebarWidth) {
      if (touchParams.currentX > touchParams.startX) {
        return sidebarWidth;
      }
      return sidebarWidth - touchParams.startX + touchParams.currentX;
    }
    return Math.min(touchParams.currentX, sidebarWidth);
  };

  const sidebarStyle = {
    ...defaultStyles.sidebar,
    ...props.styles.sidebar
  };

  const contentStyle = {
    ...defaultStyles.content,
    ...props.styles.content
  };

  const overlayStyle = {
    ...defaultStyles.overlay,
    ...props.styles.overlay
  };

  const useTouch = dragSupported && props.touch;
  const rootProps = {
    className: props.rootClassName,
    style: { ...defaultStyles.root, ...props.styles.root },
    role: 'navigation',
    id: props.rootId
  };

  let dragHandle;

  const hasBoxShadow =
    props.shadow && (isTouching() || props.open || props.docked);

  // sidebarStyle right/left
  if (props.pullRight) {
    sidebarStyle.right = 0;
    sidebarStyle.transform = 'translateX(100%)';
    sidebarStyle.WebkitTransform = 'translateX(100%)';
    if (hasBoxShadow) {
      sidebarStyle.boxShadow = '-2px 2px 4px rgba(0, 0, 0, 0.15)';
    }
  } else {
    sidebarStyle.left = 0;
    sidebarStyle.transform = 'translateX(-100%)';
    sidebarStyle.WebkitTransform = 'translateX(-100%)';
    if (hasBoxShadow) {
      sidebarStyle.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.15)';
    }
  }

  if (isTouching()) {
    const percentage = touchSidebarWidth() / sidebarWidth;

    // slide open to what we dragged
    if (props.pullRight) {
      sidebarStyle.transform = `translateX(${(1 - percentage) * 100}%)`;
      sidebarStyle.WebkitTransform = `translateX(${(1 - percentage) * 100}%)`;
    } else {
      sidebarStyle.transform = `translateX(-${(1 - percentage) * 100}%)`;
      sidebarStyle.WebkitTransform = `translateX(-${(1 - percentage) * 100}%)`;
    }

    // fade overlay to match distance of drag
    overlayStyle.opacity = percentage;
    overlayStyle.visibility = 'visible';
  } else if (props.docked) {
    // show sidebar
    if (sidebarWidth !== 0) {
      sidebarStyle.transform = `translateX(0%)`;
      sidebarStyle.WebkitTransform = `translateX(0%)`;
    }

    // make space on the left/right side of the content for the sidebar
    if (props.pullRight) {
      contentStyle.right = `${sidebarWidth}px`;
    } else {
      contentStyle.left = `${sidebarWidth}px`;
    }
  } else if (props.open) {
    // slide open sidebar
    sidebarStyle.transform = `translateX(0%)`;
    sidebarStyle.WebkitTransform = `translateX(0%)`;

    // show overlay
    overlayStyle.opacity = 1;
    overlayStyle.visibility = 'visible';
  }

  if (isTouching() || !props.transitions) {
    sidebarStyle.transition = 'none';
    sidebarStyle.WebkitTransition = 'none';
    contentStyle.transition = 'none';
    overlayStyle.transition = 'none';
  }

  if (useTouch) {
    if (props.open) {
      rootProps.onTouchStart = onTouchStart;
      rootProps.onTouchMove = onTouchMove;
      rootProps.onTouchEnd = onTouchEnd;
      rootProps.onTouchCancel = onTouchEnd;
      rootProps.onScroll = onScroll;
    } else {
      const dragHandleStyle = {
        ...defaultStyles.dragHandle,
        ...props.styles.dragHandle
      };
      dragHandleStyle.width = props.touchHandleWidth;

      // dragHandleStyle right/left
      if (props.pullRight) {
        dragHandleStyle.right = 0;
      } else {
        dragHandleStyle.left = 0;
      }

      dragHandle = (
        <div
          style={dragHandleStyle}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        />
      );
    }
  }

  return (
    <div {...rootProps}>
      <div
        className={props.sidebarClassName}
        style={sidebarStyle}
        ref={saveSidebarRef}
        id={props.sidebarId}
      >
        {props.sidebar}
      </div>
      {/* eslint-disable */}
      <div
        className={props.overlayClassName}
        style={overlayStyle}
        onClick={overlayClicked}
        id={props.overlayId}
      />
      {/* eslint-enable */}
      <div
        className={props.contentClassName}
        style={contentStyle}
        id={props.contentId}
      >
        {dragHandle}
        {props.children}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  // main content to render
  children: PropTypes.node.isRequired,

  // styles
  styles: PropTypes.shape({
    root: PropTypes.object,
    sidebar: PropTypes.object,
    content: PropTypes.object,
    overlay: PropTypes.object,
    dragHandle: PropTypes.object
  }),

  // root component optional class
  rootClassName: PropTypes.string,

  // sidebar optional class
  sidebarClassName: PropTypes.string,

  // content optional class
  contentClassName: PropTypes.string,

  // overlay optional class
  overlayClassName: PropTypes.string,

  // sidebar content to render
  sidebar: PropTypes.node.isRequired,

  // boolean if sidebar should be docked
  docked: PropTypes.bool,

  // boolean if sidebar should slide open
  open: PropTypes.bool,

  // boolean if transitions should be disabled
  transitions: PropTypes.bool,

  // boolean if touch gestures are enabled
  touch: PropTypes.bool,

  // max distance from the edge we can start touching
  touchHandleWidth: PropTypes.number,

  // Place the sidebar on the right
  pullRight: PropTypes.bool,

  // Enable/Disable sidebar shadow
  shadow: PropTypes.bool,

  // distance we have to drag the sidebar to toggle open state
  dragToggleDistance: PropTypes.number,

  // callback called when the overlay is clicked
  onSetOpen: PropTypes.func,

  // Initial sidebar width when page loads
  defaultSidebarWidth: PropTypes.number,

  // root component optional id
  rootId: PropTypes.string,

  // sidebar optional id
  sidebarId: PropTypes.string,

  // content optional id
  contentId: PropTypes.string,

  // overlay optional id
  overlayId: PropTypes.string
};

Sidebar.defaultProps = {
  docked: false,
  open: false,
  transitions: true,
  touch: true,
  touchHandleWidth: 20,
  pullRight: false,
  shadow: true,
  dragToggleDistance: 30,
  onSetOpen: () => {},
  styles: {},
  defaultSidebarWidth: 0
};

export default Sidebar;
