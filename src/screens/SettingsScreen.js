import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading, TextButton } from '../components';

export default class LoginScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.menuContainer}>
          <View>
            <Heading large>Settings</Heading>

            <View style={styles.menuItemsContainer}>
              <TextButton active style={styles.menuButton}>Account</TextButton>
              <TextButton style={styles.menuButton}>Game Settings</TextButton>
              <TextButton style={styles.menuButton}>Wallet</TextButton>
              <TextButton style={styles.menuButton}>About</TextButton>
              <TextButton style={styles.menuButton}>Updates</TextButton>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.box} />
        </View>

        <View style={styles.spacingContainer} />

        <TextButton
          style={styles.closeButton}
          textStyle={styles.closeButtonText}
        >
          X
        </TextButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 40,
    right: 40,
    borderColor: '#AAAAAA',
    borderWidth: 1,
    borderRadius: 40,
    height: 30,
    width: 30,
  },
  closeButtonText: {
    fontFamily: 'Regular',
    fontSize: 16,
  },
  container: {
    backgroundColor: '#00000066',
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 40,
    height: '100%',
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 60,
  },
  menuButton: {
    marginBottom: 12,
  },
  menuContainer: {
    alignItems: 'flex-end',
    width: '20%',
  },
  menuItemsContainer: {
    marginLeft: 10,
    marginTop: 40,
  },
  spacingContainer: {
    width: '10%',
  },
});
