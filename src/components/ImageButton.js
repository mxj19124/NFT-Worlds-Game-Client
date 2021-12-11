import React, { Component } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

export default class ImageButton extends Component {
  render() {
    const { onPress, source, imageStyle, style } = this.props;

    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <Image
          resizeMode={'contain'}
          source={source}
          style={imageStyle}
        />
      </TouchableOpacity>
    );
  }
}
