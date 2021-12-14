import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ContentBox, Heading, SubText } from '../';

export default class WalletSection extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Heading large>Wallet Settings</Heading>
        <SubText>Manage your wallet, owned worlds, $WRLD tokens and transfers.</SubText>

        <ContentBox style={styles.box}>
          <Heading>WRLD Wallet Coming Soon!</Heading>
        </ContentBox>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    marginTop: 20,
  },
});
