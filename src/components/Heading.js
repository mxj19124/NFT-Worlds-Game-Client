import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

export default class Heading extends Component {
  render() {
    const { uppercase, children, style } = this.props;

    return (
      <Text
        style={[
          uppercase ? styles.uppercase : null,
          styles.text,
          style,
        ]}
      >
        {children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: '#FFFFFF',
    fontFamily: 'Bold',
    fontSize: 16,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});
