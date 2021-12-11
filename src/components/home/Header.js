import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { shell } from 'electron';
import { ImageButton } from '../';

export default class Header extends Component {
  _openOpenSea = () => {
    shell.openExternal('https://opensea.io/collection/nft-worlds');
  }

  _openDiscord = () => {
    shell.openExternal('https://discord.gg/nft-worlds');
  }

  _openTwitter = () => {
    shell.openExternal('https://twitter.com/nftworldsNFT');
  }

  render() {
    const { style } = this.props;

    return (
      <View style={[ styles.container, style ]}>
        <View style={[ styles.headingSection, styles.headingLeft ]}>
          <ImageButton
            onPress={this._openOpenSea}
            source={require('../../assets/images/opensea.png').default}
            imageStyle={styles.socialIconImage}
            style={styles.socialIconButton}
          />

          <ImageButton
            onPress={this._openDiscord}
            source={require('../../assets/images/discord.png').default}
            imageStyle={styles.socialIconImage}
            style={styles.socialIconButton}
          />

          <ImageButton
            onPress={this._openTwitter}
            source={require('../../assets/images/twitter.png').default}
            imageStyle={styles.socialIconImage}
            style={styles.socialIconButton}
          />
        </View>

        <View style={[ styles.headingSection, styles.headingCenter ]}>
          <Image
            resizeMode={'contain'}
            source={require('../../assets/images/logo.png').default}
            style={styles.logoImage}
          />
        </View>

        <View style={[ styles.headingSection, styles.headingRight ]}>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileInfoContainer}>
              <Text style={styles.profileText}>iamarkdev</Text>
              <Text style={styles.balanceText}>0.00 WRLD</Text>
            </View>

            <Image
              source={{ uri: 'https://pbs.twimg.com/profile_images/1466125910491336711/qrfQ0gBZ_400x400.jpg' }}
              resizeMode={'contain'}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  logoImage: {
    height: 28,
    width: 200,
  },
  headingSection: {
    flex: 1,
    //backgroundColor: '#FF0000',
  },
  headingLeft: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headingCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingRight: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  socialIconButton: {
    padding: 4,
    marginLeft: 45,
  },
  socialIconImage: {
    opacity: 0.7,
    height: 23,
    width: 23,
  },
  profileInfoContainer: {
    marginRight: 15,
  },
  profileButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  profileImage: {
    borderRadius: 45,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    marginRight: 45,
    shadowColor: '#000000',
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 10,
    height: 45,
    width: 45,
  },
  profileText: {
    color: '#FFFFFF',
    fontFamily: 'Bold',
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 2,
  },
  balanceText: {
    color: '#CCCCCC',
    fontFamily: 'Bold',
    fontSize: 10,
    textAlign: 'right',
  },
});
