import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { shell } from 'electron';
import { Button, ImageButton, Heading, SubText } from '../';

export default class Header extends Component {
  _alertComingSoon = () => {
    alert('Many more NFT Worlds will be available to play soon.\n\nCurrently, only the Scavenger Hunt world is available to showcase multiplayer.');
  }

  render() {
    const { style } = this.props;

    return (
      <View style={[ styles.container, style ]}>
        <View style={styles.worldsContainer}>
          <TouchableOpacity onPress={this._alertComingSoon}>
            <Image
              source={require('../../assets/images/hidden-world-1.png').default}
              resizeMode={'contain'}
              style={styles.worldPreviewImage}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this._alertComingSoon}>
            <Image
              source={require('../../assets/images/hidden-world-2.png').default}
              resizeMode={'contain'}
              style={styles.worldPreviewImage}
            />
          </TouchableOpacity>

          <Image
            source={require('../../assets/images/world.png').default}
            resizeMode={'contain'}
            style={styles.worldImage}
          />

          <TouchableOpacity onPress={this._alertComingSoon}>
            <Image
              source={require('../../assets/images/hidden-world-3.png').default}
              resizeMode={'contain'}
              style={styles.worldPreviewImage}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this._alertComingSoon}>
            <Image
              source={require('../../assets/images/hidden-world-4.png').default}
              resizeMode={'contain'}
              style={styles.worldPreviewImage}
            />
          </TouchableOpacity>
        </View>

        <Heading style={styles.worldNameHeading}>Scavenger Hunt</Heading>
        <Heading style={styles.worldNumberHeading}>World #662</Heading>

        <Button big bold>Join World</Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  worldImage: {
    height: 219,
    width: 294,
    marginBottom: 15,
    marginHorizontal: 15,
  },
  worldPreviewImage: {
    width: 200,
    height: 149,
    marginHorizontal: 15,
    opacity: 0.8,
  },
  worldNameHeading: {
    fontSize: 18,
    marginBottom: 2,
  },
  worldNumberHeading: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 15,
  },
  worldsContainer: {
    flexDirection: 'row',
  },
});
