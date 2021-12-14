import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Heading, TextButton } from '../components';
import { AboutSection, AccountSection, GameSection, UpdatesSection, WalletSection } from '../components/settings';
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
        duration: 350,
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  _renderAccount = () => {
    return (
      <AccountSection />
    );
  }

  _renderGame = () => {
    return (
      <GameSection />
    );
  }

  _renderWallet = () => {
    return (
      <WalletSection />
    );
  }

  _renderAbout = () => {
    return (
      <AboutSection />
    );
  }

  _renderUpdates = () => {
    return (
      <UpdatesSection />
    );
  }

  render() {
    const { section, activeSidebarSection, sectionOpacity } = this.state;

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
                active={activeSidebarSection === 'game'}
                onPress={() => this._changeSection('game')}
                style={styles.menuButton}
              >
                Game
              </TextButton>

              <TextButton
                active={activeSidebarSection === 'wallet'}
                onPress={() => this._changeSection('wallet')}
                style={styles.menuButton}
              >
                Wallet
              </TextButton>

              <View style={styles.spacedMenuContainer}>
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
              </View>
            </View>
          </View>
        </View>

        <Animated.View style={[ styles.contentContainer, { opacity: sectionOpacity } ]}>
          {section === 'account' && this._renderAccount()}
          {section === 'game' && this._renderGame()}
          {section === 'wallet' && this._renderWallet()}
          {section === 'about' && this._renderAbout()}
          {section === 'updates' && this._renderUpdates()}
        </Animated.View>

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
    paddingHorizontal: 80,
  },
  menuButton: {
    paddingVertical: 6,
  },
  menuContainer: {
    alignItems: 'flex-end',
    width: '20%',
  },
  menuItemsContainer: {
    marginLeft: 10,
    marginTop: 34,
  },
  spacedMenuContainer: {
    marginVertical: 30,
  },
  spacingContainer: {
    width: '10%',
  },
});
