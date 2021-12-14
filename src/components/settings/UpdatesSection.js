import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextButton, ContentBox, Heading, SubText } from '../';

export default class UpdatesSection extends Component {
  _checkForUpdates = () => {
    alert('NFT Worlds is up to date.');
  }

  render() {
    return (
      <View style={styles.container}>
        <Heading large>Updates</Heading>
        <SubText>Download, install and review NFT Worlds updates.</SubText>

        <ContentBox style={styles.box}>
          <Heading>You Have The Latest Version Installed</Heading>

          <View style={styles.divider} />

          <TextButton
            bordered
            onPress={this._checkForUpdates}
            style={styles.updatesButton}
          >
            Check For Updates
          </TextButton>
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
});
