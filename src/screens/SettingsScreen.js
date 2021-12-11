import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

export default class LoginScreen extends Component {
  render() {
    const { loading } = this.state;

    return (
      <View style={styles.container}>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
