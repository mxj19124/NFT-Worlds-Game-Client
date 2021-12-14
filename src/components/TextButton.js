import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default class TextButton extends Component {
  render() {
    const { active, bordered, textStyle, onPress, style, children } = this.props;

    return (
      <TouchableOpacity onPress={onPress} style={[ styles.container, style ]}>
        <Text
          style={[
            styles.text,
            active ? styles.active : null,
            bordered ? styles.bordered : null,
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
  bordered: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#AAAAAA',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
  },
  text: {
    color: '#AAAAAA',
    fontFamily: 'Regular',
    fontSize: 14,
  },
});
