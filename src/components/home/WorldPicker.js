import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Heading } from '../';
import AssetGuard from '../../libs/AssetGuard';
import DistroIndex from '../../libs/DistroIndex';
import JavaGuard from '../../libs/JavaGuard';
import GameProcessBuilder from '../../libs/GameProcessBuilder';
import maestro from '../../maestro';

const { appSystemHelper } = maestro.helpers;
const { userManager } = maestro.managers;
const distributionConfig = { ...require('../../assets/data/distribution.json') };

export default class Header extends Component {
  _alertComingSoon = () => {
    alert('Many more NFT Worlds will be available to play soon.\n\nCurrently, only the Scavenger Hunt world is available to showcase multiplayer.');
  }

  _launch = async () => {
    const javaGuard = new JavaGuard();
    const appStorageDirectory = appSystemHelper.getAppStorageDirectory();
    const commonDirectory = appSystemHelper.getCommonDirectory();

    try {
      await userManager.validateOrRefreshUser();

      let javaExecutablePath = await javaGuard.validateJava(appStorageDirectory);

      if (!javaExecutablePath) {
        const installJava = confirm(
          'No Compatible Java Installation Found!\n\n' +
          'In order to play NFT Worlds, you need a 64-bit installation of Java.\n\n' +
          'Would you like us to install a copy?\n\n' +
          `By continuing you accept Oracle's license agreement.\n\n(http://www.oracle.com/technetwork/java/javase/terms/license/index.html)`
        );

        if (installJava) {
          const javaInstallAssetGuard = new AssetGuard(commonDirectory, null);

          javaInstallAssetGuard.on('progress', data => {
            console.log('GOT PROGRESS', data);
          });

          javaInstallAssetGuard.on('complete', data => {
            console.log('GOT COMPELTE', data);
          });

          javaInstallAssetGuard.on('error', data => {
            throw data;
          });

          const queueResult = await javaInstallAssetGuard._enqueueOpenJDK(appStorageDirectory);

          if (!queueResult) {
            return alert('An unexpected error occured while downloading Java. Please try again.');
          }

          await javaInstallAssetGuard.processDlQueues([
            { id: 'java', limit: 1 },
          ]);

          javaExecutablePath = await javaGuard.validateJava(appStorageDirectory);
        }
      }

      const validateJavaResult = await javaGuard._validateJavaBinary(javaExecutablePath);

      if (!validateJavaResult.valid) {
        throw new Error(`Invalid Java Detected: ${JSON.stringify(validateJavaResult)}`);
      }

      const gameAssetGuard = new AssetGuard(commonDirectory, javaExecutablePath);

      gameAssetGuard.on('progress', data => {
        console.log('GOT PROGRESS', data);
      });

      gameAssetGuard.on('complete', data => {
        console.log('GOT COMPLETE', data);
      });

      gameAssetGuard.on('error', data => {
        throw data;
      });

      const validationResult = await gameAssetGuard.validateOrDownloadEverything('main-1.12.2');
      console.log(validationResult);

      if (!validationResult.forgeData || !validationResult.versionData) {
        throw new Error('Failed to get forge or version data.');
      }

      // not getting server
      const distroIndex = await DistroIndex.fromJSON(distributionConfig);
      const server = distroIndex.getServer('main-1.12.2');

      console.log('server', server);

      const gameAccount = userManager.getGameAccount();

      // TODO: Need to refresh account session!!!!
      console.log('game account', gameAccount);

      const gameProcessBuilder = new GameProcessBuilder(
        server,
        validationResult.versionData,
        validationResult.forgeData,
        gameAccount,
        'alpha', // todo: temporary launcher version
      );

      const gameProcess = gameProcessBuilder.build(javaExecutablePath);
      gameProcess.stdout.on('data', data => console.log('stdout game:', data));
      gameProcess.stderr.on('data', data => console.log('stderr game:', data));
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
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

        <Button onPress={this._launch} big bold>Join World</Button>
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
