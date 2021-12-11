import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { BackgroundVideo } from './components';

import { LoginScreen, HomeScreen, SettingsScreen } from './screens';

export default class Main extends Component {
  state = {
    screen: 'login',
    opacityAnimated: new Animated.Value(0),
  }

  componentDidMount() {
    Font.loadAsync({
      Regular: require('./assets/fonts/Montserrat-Medium.ttf').default,
      RegularItalic: require('./assets/fonts/Montserrat-MediumItalic.ttf').default,
      Bold: require('./assets/fonts/Montserrat-Bold.ttf').default,
      BoldItalic: require('./assets/fonts/Montserrat-BoldItalic.ttf').default,
    });

    this._fade(true, 2000);
  }

  _fade = (fadeIn, durationOverride) => {
    Animated.timing(this.state.opacityAnimated, {
      toValue: fadeIn ? 1 : 0,
      duration: durationOverride || 750,
      useNativeDriver: true,
    }).start();
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
