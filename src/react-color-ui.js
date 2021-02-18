
'use strict'

import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import { SliderTitleText } from './layout'

class SketchExample extends React.Component {
  state = {
    displayColorPicker: false,
    color: {
      r: '204',
      g: '204',
      b: '204',
      a: '1',
    },
  };

  constructor(props) {
    super(props)

  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb })
    this.props.colorChanged(color);
  };

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '210px',
          height: '20px',
          borderRadius: '2px',
          background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div>
        <SliderTitleText variant="h6">Body Colour</SliderTitleText>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
        </div> : null }

      </div>
    )
  }
}

export default SketchExample