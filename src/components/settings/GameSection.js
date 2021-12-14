import React, { Component } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { ContentBox, Heading, SubText, Toggle } from '../';
import { SettingsFieldContainer } from './';

export default class GameSection extends Component {
  state = {
    shadersOn: false,
  }

  render() {
    return (
      <View style={styles.container}>
        <Heading large>Game Settings</Heading>
        <SubText>Configure in-game settings, graphics and more.</SubText>

        <View style={styles.fields}>
          <SettingsFieldContainer row>
            <View style={styles.rowFieldContainerContent}>
              <SubText bold white smallBottomSpace>Enable HD Shaders</SubText>
              <SubText small>Dramatically increases graphics quality, water effects and more.</SubText>
              <SubText small>Disable this if you are experiencing low frame rates.</SubText>
            </View>

            <Toggle isOn />
          </SettingsFieldContainer>

          <SettingsFieldContainer row>
            <View style={styles.rowFieldContainerContent}>
              <SubText bold white smallBottomSpace>Enable HD Graphics</SubText>
              <SubText small>Enables high resolution textures, foliage and texture depth.</SubText>
              <SubText small>Disable this if you are experiencing low frame rates.</SubText>
            </View>

            <Toggle isOn />
          </SettingsFieldContainer>

          <SettingsFieldContainer row>
            <View style={styles.rowFieldContainerContent}>
              <SubText bold white smallBottomSpace>Enable Default Minecraft Graphics</SubText>
              <SubText small>Completely disables NFT World texures, models and shaders.</SubText>
            </View>

            <Toggle />
          </SettingsFieldContainer>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fields: {
    marginTop: 20,
  },
  rowFieldContainerContent: {
    flex: 1,
    marginRight: 30,
  },
});
