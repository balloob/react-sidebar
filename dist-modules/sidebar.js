'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x,
    property = _x2,
    receiver = _x3; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var update = _reactAddons2['default'].addons.update;

var CANCEL_DISTANCE_ON_SCROLL = 20;

var styles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden' },
  sidebar: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.15)',
    transition: 'transform .3s ease-out',
    transform: 'translateX(-100%)',
    WebkitTransition: '-webkit-transform .3s ease-out',
    WebkitTransform: 'translateX(-100%)',
    willChange: 'transform',
    backgroundColor: 'white',
    overflowY: 'auto' },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
    transition: 'left .3s ease-out' },
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
    backgroundColor: 'rgba(0,0,0,.3)' },
  dragHandle: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0 } };

var Sidebar = (function (_React$Component) {
  function Sidebar(props) {
    _classCallCheck(this, Sidebar);

    _get(Object.getPrototypeOf(Sidebar.prototype), 'constructor', this).call(this, props);

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
      dragSupported: 'ontouchstart' in window };

    this.overlayClicked = this.overlayClicked.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  _inherits(Sidebar, _React$Component);

  _createClass(Sidebar, [{
    key: 'overlayClicked',
    value: function overlayClicked() {
      if (this.props.open) {
        this.props.onSetOpen(false);
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
          touchCurrentY: touch.clientY });
      }
    }
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(ev) {
      if (this.isTouching()) {
        for (var i = 0; i < ev.targetTouches.length; i++) {
          // we only care about the finger that we are tracking
          if (ev.targetTouches[i].identifier == this.state.touchIdentifier) {
            this.setState({
              touchCurrentX: ev.targetTouches[i].clientX,
              touchCurrentY: ev.targetTouches[i].clientY });
            break;
          }
        }
      }
    }
  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd(ev) {
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
          touchCurrentY: null });
      }
    }
  }, {
    key: 'onScroll',

    // This logic helps us prevents the user from sliding the sidebar horizontally
    // while scrolling the sidebar vertically. When a scroll event comes in, we're
    // cancelling the ongoing gesture if it did not move horizontally much.
    value: function onScroll(ev) {
      if (this.isTouching() && this.inCancelDistanceOnScroll()) {
        this.setState({
          touchIdentifier: null,
          touchStartX: null,
          touchStartY: null,
          touchCurrentX: null,
          touchCurrentY: null });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.saveSidebarWidth();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevState, prevProps) {
      // filter out the updates when we're touching
      if (!this.isTouching()) {
        this.saveSidebarWidth();
      }
    }
  }, {
    key: 'saveSidebarWidth',
    value: function saveSidebarWidth() {
      var width = _reactAddons2['default'].findDOMNode(this.refs.sidebar).offsetWidth;

      if (width != this.state.sidebarWidth) {
        this.setState({ sidebarWidth: width });
      }
    }
  }, {
    key: 'isTouching',
    value: function isTouching() {
      return this.state.touchIdentifier !== null;
    }
  }, {
    key: 'inCancelDistanceOnScroll',

    // True if the on going gesture X distance is less than the cancel distance
    value: function inCancelDistanceOnScroll() {
      return Math.abs(this.state.touchStartX - this.state.touchCurrentX) < CANCEL_DISTANCE_ON_SCROLL;
    }
  }, {
    key: 'touchSidebarWidth',

    // calculate the sidebarWidth based on current touch info
    value: function touchSidebarWidth() {
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
  }, {
    key: 'render',
    value: function render() {
      var sidebarStyle = styles.sidebar,
          contentStyle = styles.content,
          overlayStyle = styles.overlay,
          useTouch = this.state.dragSupported && this.props.touch,
          isTouching = this.isTouching(),
          dragHandle = undefined;

      var rootProps = {
        style: styles.root };

      if (isTouching) {

        var percentage = this.touchSidebarWidth() / this.state.sidebarWidth;

        // slide open to what we dragged
        sidebarStyle = update(sidebarStyle, { $merge: {
            transform: 'translateX(-' + (1 - percentage) * 100 + '%)',
            WebkitTransform: 'translateX(-' + (1 - percentage) * 100 + '%)' } });

        // fade overlay to match distance of drag
        overlayStyle = update(overlayStyle, { $merge: {
            opacity: percentage,
            visibility: 'visible' } });
      } else if (this.props.docked) {

        // show sidebar
        if (this.state.sidebarWidth !== 0)
          sidebarStyle = update(sidebarStyle, { $merge: {
            transform: 'translateX(0%)',
            WebkitTransform: 'translateX(0%)' } });

        // make space on the left size of the sidebar
        contentStyle = update(contentStyle, { $merge: {
            left: '' + this.state.sidebarWidth + 'px' } });
      } else if (this.props.open) {

        // slide open sidebar
        sidebarStyle = update(sidebarStyle, { $merge: {
            transform: 'translateX(0%)',
            WebkitTransform: 'translateX(0%)' } });

        // show overlay
        overlayStyle = update(overlayStyle, { $merge: {
            opacity: 1,
            visibility: 'visible' } });
      }

      if (isTouching || !this.props.transitions) {
        sidebarStyle = update(sidebarStyle, { $merge: {
            transition: 'none',
            WebkitTransition: 'none' } });

        contentStyle = update(contentStyle, { $merge: {
            transition: 'none' } });

        overlayStyle = update(overlayStyle, { $merge: {
            transition: 'none' } });
      }

      if (useTouch) {
        if (this.props.open) {
          rootProps.onTouchStart = this.onTouchStart;
          rootProps.onTouchMove = this.onTouchMove;
          rootProps.onTouchEnd = this.onTouchEnd;
          rootProps.onTouchCancel = this.onTouchEnd;
          rootProps.onScroll = this.onScroll;
        } else {
          var dragHandleStyle = update(styles.dragHandle, { $merge: {
              width: this.props.touchHandleWidth } });

          dragHandle = _reactAddons2['default'].createElement('div', { style: dragHandleStyle,
            onTouchStart: this.onTouchStart, onTouchMove: this.onTouchMove,
            onTouchEnd: this.onTouchEnd, onTouchCancel: this.onTouchEnd });
        }
      }

      return _reactAddons2['default'].createElement(
        'div',
        rootProps,
        _reactAddons2['default'].createElement(
          'div',
          { style: sidebarStyle, ref: 'sidebar' },
          this.props.sidebar
        ),
        _reactAddons2['default'].createElement('div', { style: overlayStyle,
          onClick: this.overlayClicked, onTouchTap: this.overlayClicked }),
        _reactAddons2['default'].createElement(
          'div',
          { style: contentStyle },
          dragHandle,
          this.props.children
        )
      );
    }
  }]);

  return Sidebar;
})(_reactAddons2['default'].Component);

;

Sidebar.propTypes = {
  // main content to render
  children: _reactAddons2['default'].PropTypes.node.isRequired,

  // sidebar content to render
  sidebar: _reactAddons2['default'].PropTypes.node.isRequired,

  // boolean if sidebar should be docked
  docked: _reactAddons2['default'].PropTypes.bool,

  // boolean if sidebar should slide open
  open: _reactAddons2['default'].PropTypes.bool,

  // boolean if transitions should be disabled
  transitions: _reactAddons2['default'].PropTypes.bool,

  // boolean if touch gestures are enabled
  touch: _reactAddons2['default'].PropTypes.bool,

  // max distance from the edge we can start touching
  touchHandleWidth: _reactAddons2['default'].PropTypes.number,

  // distance we have to drag the sidebar to toggle open state
  dragToggleDistance: _reactAddons2['default'].PropTypes.number,

  // callback called when the overlay is clicked
  onSetOpen: _reactAddons2['default'].PropTypes.func };

Sidebar.defaultProps = {
  docked: false,
  open: false,
  transitions: true,
  touch: true,
  touchHandleWidth: 20,
  dragToggleDistance: 30,
  onSetOpen: function onSetOpen() {} };

exports['default'] = Sidebar;
module.exports = exports['default'];