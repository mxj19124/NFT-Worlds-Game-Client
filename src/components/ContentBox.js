import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

export default class ContentBox extends Component {
  render() {
    const { children, style } = this.props;

    return (
      <View style={[ styles.container, style ]}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00000044',
    borderWidth: 1,
    borderColor: '#CCCCCC33',
    borderRadius: 3,
    padding: 12,
  },
});
