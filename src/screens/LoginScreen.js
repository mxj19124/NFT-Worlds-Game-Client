import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default class LoginScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png').default}
          resizeMode={'contain'}
          style={styles.logoImage}
        />

        <View style={styles.loginForm}>
          <Text style={{ fontSize: 24, fontFamily: 'Bold', color: '#FFFFFF' }}>Testing 123</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logoImage: {
    height: 42,
    width: 300,
  },
  loginForm: {
    marginTop: 30,
  },
});
