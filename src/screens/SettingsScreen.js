import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Heading, TextButton } from '../components';
import maestro from '../maestro';

const { navigationHelper } = maestro.helpers;

export default class LoginScreen extends Component {
  state = {
    activeSidebarSection: 'account',
    section: 'account',
    sectionOpacity: new Animated.Value(1),
  }

  _closeSettings = () => {
    navigationHelper.openScreen('home');
  }

  _changeSection = async section => {
    this.setState({ activeSidebarSection: section });
    await this._animateSection(false);
    this.setState({ section }, () => this._animateSection(true));
  }

  _animateSection = async show => {
    return new Promise(resolve => {
      Animated.timing(this.state.sectionOpacity, {
        toValue: show ? 1 : 0,
        duration: 500,
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  _renderAccount = () => {
    return (
      <View />
    );
  }

  _renderGameSettings = () => {
    return (
      <View />
    );
  }

  _renderWallet = () => {
    return (
      <View />
    );
  }

  _renderAbout = () => {
    return (
      <View />
    );
  }

  _renderUpdates = () => {
    return (
      <View />
    );
  }

  _logout = () => {
    navigationHelper.openScreen('login');
  }

  render() {
    const { section, activeSidebarSection } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.menuContainer}>
          <View>
            <Heading unbold large>Settings</Heading>

            <View style={styles.menuItemsContainer}>
              <TextButton
                active={activeSidebarSection === 'account'}
                onPress={() => this._changeSection('account')}
                style={styles.menuButton}
              >
                Account
              </TextButton>

              <TextButton
                active={activeSidebarSection === 'settings'}
                onPress={() => this._changeSection('settings')}
                style={styles.menuButton}
              >
                Game Settings
              </TextButton>

              <TextButton
                active={activeSidebarSection === 'wallet'}
                onPress={() => this._changeSection('wallet')}
                style={styles.menuButton}
              >
                Wallet
              </TextButton>

              <TextButton
                active={activeSidebarSection === 'about'}
                onPress={() => this._changeSection('about')}
                style={styles.menuButton}
              >
                About
              </TextButton>

              <TextButton
                active={activeSidebarSection === 'updates'}
                onPress={() => this._changeSection('updates')}
                style={styles.menuButton}
              >
                Updates
              </TextButton>

              <View style={styles.divider} />

              <TextButton onPress={this._logout} style={styles.menuButton}>Logout</TextButton>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.box} />
        </View>

        <View style={styles.spacingContainer} />

        <TextButton
          onPress={this._closeSettings}
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
  divider: {
    backgroundColor: '#AAAAAA',
    height: 1,
    marginBottom: 10,
    width: 65,
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
