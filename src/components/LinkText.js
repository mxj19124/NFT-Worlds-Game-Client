import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default class LinkText extends Component {
  render() {
    const { onPress, children, style } = this.props;

    return (
      <TouchableOpacity onPress={onPress} style={[ styles.button, style ]}>
        <Text style={styles.text}>{children}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
  },
  text :{
    fontFamily: 'Regular',
    fontSize: 12,
    color: '#CCCCCC',
  },
});
