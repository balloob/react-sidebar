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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var TouchDragListener = (function (_React$Component) {
  function TouchDragListener(props) {
    _classCallCheck(this, TouchDragListener);

    _get(Object.getPrototypeOf(TouchDragListener.prototype), 'constructor', this).call(this, props);

    this.state = {
      touching: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0 };

    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
  }

  _inherits(TouchDragListener, _React$Component);

  _createClass(TouchDragListener, [{
    key: 'touchStart',
    value: function touchStart(ev) {
      var startX = ev.targetTouches[0].clientX,
          startY = ev.targetTouches[0].clientY;

      this.setState({
        touching: true,
        startX: startX,
        startY: startY,
        currentX: startX,
        currentY: startY });

      this.props.onDrag({
        startX: startX,
        startY: startY,
        currentX: startX,
        currentY: startY });
    }
  }, {
    key: 'touchMove',
    value: function touchMove(ev) {
      if (this.state.touching) {
        this.setState({
          currentX: ev.targetTouches[0].clientX,
          currentY: ev.targetTouches[0].clientY });

        this.props.onDrag({
          startX: this.state.startX,
          startY: this.state.startY,
          currentX: ev.targetTouches[0].clientX,
          currentY: ev.targetTouches[0].clientY });
      }
    }
  }, {
    key: 'touchEnd',
    value: function touchEnd(ev) {
      if (this.state.touching) {
        this.setState({
          touching: false,
          touchOrigin: 0,
          touchSidebarWidth: 0 });

        this.props.onDrag({
          startX: this.state.startX,
          startY: this.state.startY,
          currentX: this.state.currentX,
          currentY: this.state.currentY,
          end: true });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { style: this.props.style,
          onTouchStart: this.touchStart, onTouchMove: this.touchMove,
          onTouchEnd: this.touchEnd, onTouchCancel: this.touchEnd },
        this.props.children
      );
    }
  }]);

  return TouchDragListener;
})(_react2['default'].Component);

TouchDragListener.propTypes = {
  onDrag: _react2['default'].PropTypes.func.isRequired };

exports['default'] = TouchDragListener;
module.exports = exports['default'];