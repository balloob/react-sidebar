'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CANCEL_DISTANCE_ON_SCROLL = 20;

var defaultStyles = {
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
    overflow: 'auto',
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
    transition: 'opacity .3s ease-out',
    backgroundColor: 'rgba(0,0,0,.3)'
  },
  dragHandle: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    bottom: 0
  }
};

var Sidebar = function (_React$Component) {
  _inherits(Sidebar, _React$Component);

  function Sidebar(props) {
    _classCallCheck(this, Sidebar);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Sidebar).call(this, props));

    _this.state = {
      // the detected width of the sidebar in pixels
      sidebarWidth: 0,

      // keep track of touching params
      touchIdentifier: null,
      touchStartX: null,
      touchStartY: null,
      touchCurrentX: null,
      touchCurrentY: null,

      // if touch is supported by the browser
      dragSupported: false
    };

    _this.overlayClicked = _this.overlayClicked.bind(_this);
    _this.onTouchStart = _this.onTouchStart.bind(_this);
    _this.onTouchMove = _this.onTouchMove.bind(_this);
    _this.onTouchEnd = _this.onTouchEnd.bind(_this);
    _this.onScroll = _this.onScroll.bind(_this);
    return _this;
  }

  _createClass(Sidebar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({
        dragSupported: (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && 'ontouchstart' in window
      });
      this.saveSidebarWidth();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      // filter out the updates when we're touching
      if (!this.isTouching()) {
        this.saveSidebarWidth();
      }
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(ev) {
      // filter out if a user starts swiping with a second finger
      if (!this.isTouching()) {
        var touch = ev.targetTouches[0];
        this.setState({
          touchIdentifier: touch.identifier,
          touchStartX: touch.clientX,
          touchStartY: touch.clientY,
          touchCurrentX: touch.clientX,
          touchCurrentY: touch.clientY
        });
      }
    }
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(ev) {
      if (this.isTouching()) {
        for (var ind = 0; ind < ev.targetTouches.length; ind++) {
          // we only care about the finger that we are tracking
          if (ev.targetTouches[ind].identifier === this.state.touchIdentifier) {
            this.setState({
              touchCurrentX: ev.targetTouches[ind].clientX,
              touchCurrentY: ev.targetTouches[ind].clientY
            });
            break;
          }
        }
      }
    }
  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd() {
      if (this.isTouching()) {
        // trigger a change to open if sidebar has been dragged beyond dragToggleDistance
        var touchWidth = this.touchSidebarWidth();

        if (this.props.open && touchWidth < this.state.sidebarWidth - this.props.dragToggleDistance || !this.props.open && touchWidth > this.props.dragToggleDistance) {
          this.props.onSetOpen(!this.props.open);
        }

        this.setState({
          touchIdentifier: null,
          touchStartX: null,
          touchStartY: null,
          touchCurrentX: null,
          touchCurrentY: null
        });
      }
    }

    // This logic helps us prevents the user from sliding the sidebar horizontally
    // while scrolling the sidebar vertically. When a scroll event comes in, we're
    // cancelling the ongoing gesture if it did not move horizontally much.

  }, {
    key: 'onScroll',
    value: function onScroll() {
      if (this.isTouching() && this.inCancelDistanceOnScroll()) {
        this.setState({
          touchIdentifier: null,
          touchStartX: null,
          touchStartY: null,
          touchCurrentX: null,
          touchCurrentY: null
        });
      }
    }

    // True if the on going gesture X distance is less than the cancel distance

  }, {
    key: 'inCancelDistanceOnScroll',
    value: function inCancelDistanceOnScroll() {
      var cancelDistanceOnScroll = void 0;

      if (this.props.pullRight) {
        cancelDistanceOnScroll = Math.abs(this.state.touchCurrentX - this.state.touchStartX) < CANCEL_DISTANCE_ON_SCROLL;
      } else {
        cancelDistanceOnScroll = Math.abs(this.state.touchStartX - this.state.touchCurrentX) < CANCEL_DISTANCE_ON_SCROLL;
      }
      return cancelDistanceOnScroll;
    }
  }, {
    key: 'isTouching',
    value: function isTouching() {
      return this.state.touchIdentifier !== null;
    }
  }, {
    key: 'overlayClicked',
    value: function overlayClicked() {
      if (this.props.open) {
        this.props.onSetOpen(false);
      }
    }
  }, {
    key: 'saveSidebarWidth',
    value: function saveSidebarWidth() {
      var width = _reactDom2.default.findDOMNode(this.refs.sidebar).offsetWidth;

      if (width !== this.state.sidebarWidth) {
        this.setState({ sidebarWidth: width });
      }
    }

    // calculate the sidebarWidth based on current touch info

  }, {
    key: 'touchSidebarWidth',
    value: function touchSidebarWidth() {
      // if the sidebar is open and start point of drag is inside the sidebar
      // we will only drag the distance they moved their finger
      // otherwise we will move the sidebar to be below the finger.
      if (this.props.pullRight) {
        if (this.props.open && window.innerWidth - this.state.touchStartX < this.state.sidebarWidth) {
          if (this.state.touchCurrentX > this.state.touchStartX) {
            return this.state.sidebarWidth + this.state.touchStartX - this.state.touchCurrentX;
          }
          return this.state.sidebarWidth;
        }
        return Math.min(window.innerWidth - this.state.touchCurrentX, this.state.sidebarWidth);
      }

      if (this.props.open && this.state.touchStartX < this.state.sidebarWidth) {
        if (this.state.touchCurrentX > this.state.touchStartX) {
          return this.state.sidebarWidth;
        }
        return this.state.sidebarWidth - this.state.touchStartX + this.state.touchCurrentX;
      }
      return Math.min(this.state.touchCurrentX, this.state.sidebarWidth);
    }
  }, {
    key: 'render',
    value: function render() {
      var sidebarStyle = _extends({}, defaultStyles.sidebar, this.props.styles.sidebar);
      var contentStyle = _extends({}, defaultStyles.content, this.props.styles.content);
      var overlayStyle = _extends({}, defaultStyles.overlay, this.props.styles.overlay);
      var useTouch = this.state.dragSupported && this.props.touch;
      var isTouching = this.isTouching();
      var rootProps = {
        className: this.props.rootClassName,
        style: _extends({}, defaultStyles.root, this.props.styles.root)
      };
      var dragHandle = void 0;

      // sidebarStyle right/left
      if (this.props.pullRight) {
        sidebarStyle.right = 0;
        sidebarStyle.transform = 'translateX(100%)';
        sidebarStyle.WebkitTransform = 'translateX(100%)';
        if (this.props.shadow) {
          sidebarStyle.boxShadow = '-2px 2px 4px rgba(0, 0, 0, 0.15)';
        }
      } else {
        sidebarStyle.left = 0;
        sidebarStyle.transform = 'translateX(-100%)';
        sidebarStyle.WebkitTransform = 'translateX(-100%)';
        if (this.props.shadow) {
          sidebarStyle.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.15)';
        }
      }

      if (isTouching) {
        var percentage = this.touchSidebarWidth() / this.state.sidebarWidth;

        // slide open to what we dragged
        if (this.props.pullRight) {
          sidebarStyle.transform = 'translateX(' + (1 - percentage) * 100 + '%)';
          sidebarStyle.WebkitTransform = 'translateX(' + (1 - percentage) * 100 + '%)';
        } else {
          sidebarStyle.transform = 'translateX(-' + (1 - percentage) * 100 + '%)';
          sidebarStyle.WebkitTransform = 'translateX(-' + (1 - percentage) * 100 + '%)';
        }

        // fade overlay to match distance of drag
        overlayStyle.opacity = percentage;
        overlayStyle.visibility = 'visible';
      } else if (this.props.docked) {
        // show sidebar
        if (this.state.sidebarWidth !== 0) {
          sidebarStyle.transform = 'translateX(0%)';
          sidebarStyle.WebkitTransform = 'translateX(0%)';
        }

        // make space on the left/right side of the content for the sidebar
        if (this.props.pullRight) {
          contentStyle.right = this.state.sidebarWidth + 'px';
        } else {
          contentStyle.left = this.state.sidebarWidth + 'px';
        }
      } else if (this.props.open) {
        // slide open sidebar
        sidebarStyle.transform = 'translateX(0%)';
        sidebarStyle.WebkitTransform = 'translateX(0%)';

        // show overlay
        overlayStyle.opacity = 1;
        overlayStyle.visibility = 'visible';
      }

      if (isTouching || !this.props.transitions) {
        sidebarStyle.transition = 'none';
        sidebarStyle.WebkitTransition = 'none';
        contentStyle.transition = 'none';
        overlayStyle.transition = 'none';
      }

      if (useTouch) {
        if (this.props.open) {
          rootProps.onTouchStart = this.onTouchStart;
          rootProps.onTouchMove = this.onTouchMove;
          rootProps.onTouchEnd = this.onTouchEnd;
          rootProps.onTouchCancel = this.onTouchEnd;
          rootProps.onScroll = this.onScroll;
        } else {
          var dragHandleStyle = _extends({}, defaultStyles.dragHandle, this.props.styles.dragHandle);
          dragHandleStyle.width = this.props.touchHandleWidth;

          // dragHandleStyle right/left
          if (this.props.pullRight) {
            dragHandleStyle.right = 0;
          } else {
            dragHandleStyle.left = 0;
          }

          dragHandle = _react2.default.createElement('div', { style: dragHandleStyle,
            onTouchStart: this.onTouchStart, onTouchMove: this.onTouchMove,
            onTouchEnd: this.onTouchEnd, onTouchCancel: this.onTouchEnd });
        }
      }

      return _react2.default.createElement(
        'div',
        rootProps,
        _react2.default.createElement(
          'div',
          { className: this.props.sidebarClassName, style: sidebarStyle, ref: 'sidebar' },
          this.props.sidebar
        ),
        _react2.default.createElement('div', { className: this.props.overlayClassName,
          style: overlayStyle,
          role: 'presentation',
          tabIndex: '0',
          onClick: this.overlayClicked
        }),
        _react2.default.createElement(
          'div',
          { className: this.props.contentClassName, style: contentStyle },
          dragHandle,
          this.props.children
        )
      );
    }
  }]);

  return Sidebar;
}(_react2.default.Component);

Sidebar.propTypes = {
  // main content to render
  children: _react2.default.PropTypes.node.isRequired,

  // styles
  styles: _react2.default.PropTypes.shape({
    root: _react2.default.PropTypes.object,
    sidebar: _react2.default.PropTypes.object,
    content: _react2.default.PropTypes.object,
    overlay: _react2.default.PropTypes.object,
    dragHandle: _react2.default.PropTypes.object
  }),

  // root component optional class
  rootClassName: _react2.default.PropTypes.string,

  // sidebar optional class
  sidebarClassName: _react2.default.PropTypes.string,

  // content optional class
  contentClassName: _react2.default.PropTypes.string,

  // overlay optional class
  overlayClassName: _react2.default.PropTypes.string,

  // sidebar content to render
  sidebar: _react2.default.PropTypes.node.isRequired,

  // boolean if sidebar should be docked
  docked: _react2.default.PropTypes.bool,

  // boolean if sidebar should slide open
  open: _react2.default.PropTypes.bool,

  // boolean if transitions should be disabled
  transitions: _react2.default.PropTypes.bool,

  // boolean if touch gestures are enabled
  touch: _react2.default.PropTypes.bool,

  // max distance from the edge we can start touching
  touchHandleWidth: _react2.default.PropTypes.number,

  // Place the sidebar on the right
  pullRight: _react2.default.PropTypes.bool,

  // Enable/Disable sidebar shadow
  shadow: _react2.default.PropTypes.bool,

  // distance we have to drag the sidebar to toggle open state
  dragToggleDistance: _react2.default.PropTypes.number,

  // callback called when the overlay is clicked
  onSetOpen: _react2.default.PropTypes.func
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
  onSetOpen: function onSetOpen() {},
  styles: {}
};

exports.default = Sidebar;