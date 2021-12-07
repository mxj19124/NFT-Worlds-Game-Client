import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

export default class Heading extends Component {
  render() {
    const { children, style } = this.props;

    return (
      <Text style={[ styles.text, style ]}>{children}</Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: '#FFFFFF',
    fontFamily: 'Bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});
