import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, WorldPicker } from '../components/home';
import { SubText } from '../components';

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header style={styles.header} />
        <WorldPicker style={styles.worldPicker} />

        <SubText style={styles.versionText}>Alpha Version 0.0.1</SubText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    marginTop: 30,
  },
  versionText: {
    alignSelf: 'center',
    bottom: 8,
    color: '#333333',
    position: 'fixed',
  },
  worldPicker: {
    marginTop: 45,
  },
});
