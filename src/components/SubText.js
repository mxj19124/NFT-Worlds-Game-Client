import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

export default class SubText extends Component {
  render() {
    const { style, children, ...props } = this.props;

    return (
      <Text
        style={[ styles.text, style ]}
        {...props}
      >
        {children}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Regular',
  },
});
