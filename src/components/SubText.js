import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

export default class SubText extends Component {
  render() {
    const { smallBottomSpace, small, bold, white, style, children, ...props } = this.props;

    return (
      <Text
        style={[
          styles.text,
          bold ? styles.bold : null,
          white ? styles.white : null,
          small ? styles.small : null,
          smallBottomSpace ? styles.smallBottomSpace : null,
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  smallBottomSpace: {
    marginBottom: 5,
  },
  small: {
    fontSize: 12,
  },
  bold: {
    fontFamily: 'Bold',
  },
  white: {
    color: '#FFFFFF',
  },
  text: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Regular',
  },
});
