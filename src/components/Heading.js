import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

export default class Heading extends Component {
  render() {
    const { uppercase, large, children, style } = this.props;

    return (
      <Text
        style={[
          styles.text,
          uppercase ? styles.uppercase : null,
          large ? styles.large : null,
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
  large: {
    fontSize: 18,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});
