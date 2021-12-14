import React, { Component } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { BackgroundVideo } from './components';
import maestro from './maestro';

import { LoginScreen, HomeScreen, SettingsScreen } from './screens';

export default class Main extends Component {
  state = {
    screen: 'login',
    opacityAnimated: new Animated.Value(0),
  }

  componentDidMount() {
    maestro.link(this);

    Font.loadAsync({
      Regular: require('./assets/fonts/Montserrat-Medium.ttf').default,
      RegularItalic: require('./assets/fonts/Montserrat-MediumItalic.ttf').default,
      Bold: require('./assets/fonts/Montserrat-Bold.ttf').default,
      BoldItalic: require('./assets/fonts/Montserrat-BoldItalic.ttf').default,
    });

    this._fade(true, 2000);
  }

  componentWillUnmount() {
    maestro.unlink(this);
  }

  async receiveEvent(eventName, data) {
    if (eventName === 'OPEN_SCREEN') {
      await this._fade(false);

      this.setState({ screen: data.screenName }, () => {
        this._fade(true);
      });
    }
  }

  _fade = async (fadeIn, durationOverride = null) => {
    return new Promise(resolve => {
      Animated.timing(this.state.opacityAnimated, {
        toValue: fadeIn ? 1 : 0,
        duration: durationOverride || 750,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  render() {
    const { screen, opacityAnimated } = this.state;

    return (
      <View style={styles.container}>
        <Animated.View style={[ styles.fadeContainer, { opacity: opacityAnimated } ]}>
          {screen === 'login' && (<LoginScreen />)}
          {screen === 'home' && (<HomeScreen />)}
          {screen === 'settings' && (<SettingsScreen />)}
        </Animated.View>

        <BackgroundVideo />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fadeContainer: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
});
