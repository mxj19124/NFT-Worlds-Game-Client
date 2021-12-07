import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default class TextInputField extends Component {
  render() {
    const { placeholder, textInputStyle, style, ...props } = this.props;

    return (
      <View style={[ styles.container, style ]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={'#CCCCCC'}
          style={[ styles.textInput, textInputStyle ]}
          {...props}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  textInput: {
    color: '#FFFFFF',
    fontFamily: 'Regular',
    fontSize: 14,
    paddingVertical: 3,
  },
});
