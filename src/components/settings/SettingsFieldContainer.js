import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

export default class SettingsFieldContainer extends Component {
  render() {
    const { row, style, children } = this.props;

    return (
      <View
        style={[
          styles.container,
          row ? styles.row : null,
          style,
        ]}
      >
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
    borderColor: '#FFFFFF66',
    borderBottomWidth: 1,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
