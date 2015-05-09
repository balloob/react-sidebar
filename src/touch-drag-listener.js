import React from 'react';

class TouchDragListener extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      touching: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
    };

    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
  }

  touchStart(ev) {
    let startX = ev.targetTouches[0].clientX,
        startY = ev.targetTouches[0].clientY;

    this.setState({
      touching: true,
      startX: startX,
      startY: startY,
      currentX: startX,
      currentY: startY,
    });

    this.props.onDrag({
      startX: startX,
      startY: startY,
      currentX: startX,
      currentY: startY,
    });
  }

  touchMove(ev) {
    if (this.state.touching) {
      this.setState({
        currentX: ev.targetTouches[0].clientX,
        currentY: ev.targetTouches[0].clientY,
      });

      this.props.onDrag({
        startX: this.state.startX,
        startY: this.state.startY,
        currentX: ev.targetTouches[0].clientX,
        currentY: ev.targetTouches[0].clientY,
      });
    }
  }

  touchEnd(ev) {
    if (this.state.touching) {
      this.setState({
        touching: false,
        touchOrigin: 0,
        touchSidebarWidth: 0,
      });

      this.props.onDrag({
        startX: this.state.startX,
        startY: this.state.startY,
        currentX: this.state.currentX,
        currentY: this.state.currentY,
        end: true,
      });
    }
  }

  render() {
    return (
      <div style={this.props.style}
           onTouchStart={this.touchStart} onTouchMove={this.touchMove}
           onTouchEnd={this.touchEnd} onTouchCancel={this.touchEnd}>
           {this.props.children}
      </div>);
  }
}

TouchDragListener.propTypes = {
  onDrag: React.PropTypes.func.isRequired,
}

export default TouchDragListener;
