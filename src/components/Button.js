import React, { Component } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default class Button extends Component {
  render() {
    const { bold, big, style, textStyle, children, loading, ...props } = this.props;

    return (
      <TouchableOpacity disabled={loading} {...props} style={[ styles.button, style ]}>
        {!loading && (
          <Text
            style={[
              styles.text,
              big ? styles.big : null,
              bold ? styles.bold : null,
              textStyle,
            ]}
          >
            {children}
          </Text>
        )}

        {loading && (
          <ActivityIndicator size={'small'} color={'#FFFFFF'} />
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  big: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  bold: {
    fontFamily: 'Bold',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FFFFFF',
    borderRadius: 3,
    borderWidth: 1,
    minHeight: 32,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Regular',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});
