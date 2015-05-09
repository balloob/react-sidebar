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

var _touchDragListener = require('./touch-drag-listener');

var _touchDragListener2 = _interopRequireDefault(_touchDragListener);

var update = _reactAddons2['default'].addons.update;

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
    transition: 'transform .3s ease-out',
    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.15)',
    transform: 'translateX(-100%)',
    willChange: 'transform',
    backgroundColor: 'white' },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'scroll',
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

      // if we are currently dragging
      dragging: false,

      // the distance we dragged on the X-axis
      dragX: 0,

      // if touch is supported by the browser
      dragSupported: 'ontouchstart' in window };

    this.overlayClicked = this.overlayClicked.bind(this);
    this.onDrag = this.onDrag.bind(this);
  }

  _inherits(Sidebar, _React$Component);

  _createClass(Sidebar, [{
    key: 'overlayClicked',
    value: function overlayClicked() {
      if (this.props.open) {
        this.props.setOpen(false);
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
      // filter out the updates when we're dragging
      if (!this.state.dragging) {
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
    key: 'onDrag',
    value: function onDrag(info) {
      var dragX = info.currentX - info.startX;

      if (this.props.open) {
        // swiping on the overlay should only impact the sidebar once the finger
        // is over the sidebar
        dragX += info.startX - this.state.sidebarWidth;
      }

      if (info.end) {
        this.setState({ dragging: false, dragX: 0 });

        // if start position == end position, it was a tap on the drag handler
        // if sidebar is open, a tap will close the bar.
        var isTap = info.currentX == info.startX && info.currentY == info.startY;

        if (this.props.open && (isTap || dragX < -this.props.dragToggleDistance) || !this.props.open && dragX > this.props.dragToggleDistance) {
          this.props.setOpen(!this.props.open);
          this.setState({ dragging: false });
        }

        return;
      }

      this.setState({ dragging: true, dragX: dragX });
    }
  }, {
    key: 'render',
    value: function render() {
      var sidebarStyle = styles.sidebar,
          contentStyle = styles.content,
          overlayStyle = styles.overlay,
          showDragHandle = this.state.dragSupported && this.props.touch && !this.props.docked,
          dragHandleStyle = undefined,
          overlay = undefined,
          children = undefined;

      if (this.state.dragging) {

        var percentage = undefined;

        if (this.props.open && this.state.dragX > 0) {
          percentage = 0;
        } else {
          percentage = Math.abs(this.state.dragX / this.state.sidebarWidth);

          if (!this.props.open) {
            percentage = 1 - percentage;
          }
        }

        // slide open to what we dragged
        sidebarStyle = update(sidebarStyle, { $merge: {
            transform: 'translateX(-' + percentage * 100 + '%)' } });

        // fade overlay to match distance of drag
        overlayStyle = update(overlayStyle, { $merge: {
            opacity: 1 - percentage,
            visibility: 'visible' } });
      } else if (this.props.docked) {

        // show sidebar
        sidebarStyle = update(sidebarStyle, { $merge: {
            transform: 'translateX(0%)' } });

        // make space on the left size of the sidebar
        contentStyle = update(contentStyle, { $merge: {
            left: '' + this.state.sidebarWidth + 'px' } });
      } else if (this.props.open) {

        // slide open sidebar
        sidebarStyle = update(sidebarStyle, { $merge: {
            transform: 'translateX(0%)' } });

        // show overlay
        overlayStyle = update(overlayStyle, { $merge: {
            opacity: 1,
            visibility: 'visible' } });
      } else {

        // hide sidebar
        sidebarStyle = update(sidebarStyle, { $merge: {
            transform: 'translateX(-100%)' } });
      }

      if (this.state.dragging || !this.props.transitions) {
        sidebarStyle = update(sidebarStyle, { $merge: {
            transition: 'none' } });

        contentStyle = update(contentStyle, { $merge: {
            transition: 'none' } });

        overlayStyle = update(overlayStyle, { $merge: {
            transition: 'none' } });
      }

      if (showDragHandle) {
        if (this.props.open) {
          dragHandleStyle = update(styles.dragHandle, { $merge: {
              left: this.state.sidebarWidth,
              right: 0 } });
        } else {
          dragHandleStyle = update(styles.dragHandle, { $merge: {
              left: 0,
              width: this.props.dragHandleWidth } });
        }
      }

      return _reactAddons2['default'].createElement(
        'div',
        { style: styles.root },
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
          showDragHandle && _reactAddons2['default'].createElement(_touchDragListener2['default'], { onDrag: this.onDrag, style: dragHandleStyle }),
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

  // max distance from the edge we can start dragging
  dragHandleWidth: _reactAddons2['default'].PropTypes.number,

  // distance we have to drag the sidebar to toggle open state
  dragToggleDistance: _reactAddons2['default'].PropTypes.number,

  // callback called when the overlay is clicked
  setOpen: _reactAddons2['default'].PropTypes.func };

Sidebar.defaultProps = {
  docked: false,
  open: false,
  transitions: true,
  touch: true,
  dragHandleWidth: 20,
  dragToggleDistance: 30,
  setOpen: function setOpen() {} };

exports['default'] = Sidebar;
module.exports = exports['default'];