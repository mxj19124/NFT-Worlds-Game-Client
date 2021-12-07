import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';

export default class BackgroundVideo extends Component {
  state ={
    opacityAnimated: new Animated.Value(0,)
  }

  _fadeInVideo = () => {
    Animated.timing(this.state.opacityAnimated, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const { opacityAnimated } = this.state;

    return (
      <Animated.View style={[ styles.container, { opacity: opacityAnimated } ]}>
        <Video
          source={require('../assets/videos/background.mp4').default}
          shouldPlay
          isLooping
          resizeMode={'cover'}
          onLoad={() => this._fadeInVideo()}
          style={styles.video}
        />

        <View style={styles.overlay} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  video: {
    flex: 1,
  },
  overlay: {
    backgroundColor: '#000000',
    ...StyleSheet.absoluteFillObject,
    opacity: 0.65,
  },
});
