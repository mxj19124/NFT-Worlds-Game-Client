import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ContentBox, Heading, SubText, TextButton } from '../';

export default class AboutSection extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Heading large>About</Heading>
        <SubText>Information about version updates and more.</SubText>

        <ContentBox style={styles.box}>
          <Image
            source={require('../../assets/images/logo.png').default}
            resizeMode={'contain'}
            style={styles.logoImage}
          />

          <View style={styles.divider} />

          <View style={styles.releaseContainer}>
            <View style={styles.releaseDetails}>
              <SubText small bold white>Alpha Release</SubText>
              <SubText small>Version 0.0.1</SubText>
            </View>
          </View>
        </ContentBox>

        <ContentBox style={styles.box}>
          <SubText smallBottomSpace small>Release Notes</SubText>
          <Heading>Alpha v0.0.1</Heading>

          <View style={styles.divider} />

          <SubText small white>This is the first release of NFT Worlds and our launcher. This initial release is bare bones and just includes the core functionality required to showcase multiplayer in the NFT Worlds scavenger hunt multiplayer demonstration.</SubText>
        </ContentBox>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    marginTop: 20,
  },
  divider: {
    backgroundColor: '#CCCCCC33',
    height: 1,
    marginVertical: 12,
    width: '100%',
  },
  logoImage: {
    height: 30,
    width: 214,
  },
});
