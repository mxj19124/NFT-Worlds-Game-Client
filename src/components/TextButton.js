import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default class TextButton extends Component {
  render() {
    const { active, textStyle, style, children } = this.props;

    return (
      <TouchableOpacity style={[ styles.container, style ]}>
        <Text
          style={[
            styles.text,
            active ? styles.active : null,
            textStyle,
          ]}
        >
          {children}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  },
  active: {
    color: '#FFFFFF',
  },
  text: {
    color: '#AAAAAA',
    fontFamily: 'Regular',
    fontSize: 14,
  },
});
