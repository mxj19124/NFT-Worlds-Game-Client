import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ContentBox, Heading, SubText, TextButton } from '../';
import maestro from '../../maestro';

const { navigationHelper } = maestro.helpers;
const { userManager } = maestro.managers;

export default class AccountSection extends Component {
  _logout = () => {
    userManager.logout();
    navigationHelper.openScreen('login');
  }

  render() {
    const selectedProfile = userManager.getSelectedProfile();

    return (
      <View style={styles.container}>
        <Heading large>Account Settings</Heading>
        <SubText>Manage your current account's details.</SubText>

        <ContentBox style={styles.box}>
          <SubText bold>Username</SubText>
          <SubText white>{selectedProfile.name}</SubText>

          <View style={styles.fieldSpacer} />

          <SubText bold>UUID</SubText>
          <SubText white>{selectedProfile.id}</SubText>

          <TextButton
            onPress={this._logout}
            style={styles.logoutButton}
            textStyle={styles.logoutText}
          >
            Logout
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
  container: {
    width: '100%',
  },
  fieldSpacer: {
    height: 15,
  },
  logoutButton: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#FF0000',
    padding: 4,
    position: 'absolute',
    right: 12,
    top: 12,
    opacity: 0.5,
  },
  logoutText: {
    color: '#FF0000',
    fontSize: 12,
    fontFamily: 'Bold',
  },
});
