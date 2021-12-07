import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default class Button extends Component {
  render() {
    const { style, textStyle, children, ...props } = this.props;

    return (
      <TouchableOpacity {...props} style={[ styles.button, style  ]}>
        <Text style={[ styles.text, textStyle ]}>{children}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Regular',
  },
});
