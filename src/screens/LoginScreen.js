import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, Heading, TextInputField, LinkText } from '../components';

export default class LoginScreen extends Component {
  _openForgotPassword = () => {

  }

  _openCreateAccount = () => {

  }

  _openNFTWorlds = () => {

  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png').default}
          resizeMode={'contain'}
          style={styles.logoImage}
        />

        <View style={styles.loginForm}>
          <Heading style={styles.heading}>Minecraft Login</Heading>
          <Text style={styles.infoText}>Your Minecraft account is used to login.</Text>

          <TextInputField
            placeholder={'Email Address'}
            textInputStyle={styles.textInputText}
            style={styles.textInput}
          />

          <TextInputField
            placeholder={'Password'}
            secureTextEntry
            textInputStyle={styles.textInputText}
            style={styles.textInput}
          />

          <Button>Login</Button>
        </View>

        <View style={styles.linksContainer}>
          <LinkText onPress={this._openForgotPassword}>forgot password?</LinkText>
          <LinkText onPress={this._openCreateAccount}>need an account?</LinkText>
        </View>

        <LinkText onPress={this._openNFTWorlds} style={styles.visitLink}>visit nftworlds.com</LinkText>

        <Text style={[ styles.infoText, styles.disclaimerText ]}>NFT Worlds is not affiliated with Mojang AB.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    textAlign: 'center',
    marginBottom: 2,
  },
  logoImage: {
    height: 42,
    width: 300,
  },
  loginForm: {
    backgroundColor: '#00000066',
    borderRadius: 3,
    marginTop: 30,
    minWidth: 250,
    padding: 30,
  },
  textInput: {
    marginBottom: 30,
  },
  textInputText: {
    textAlign: 'center',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    width: 250,
  },
  infoText: {
    color: '#CCCCCC',
    fontFamily: 'regular',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 30,
  },
  visitLink: {
    alignSelf: 'center',
    marginTop: 10,
  },
  disclaimerText: {
    color: '#666666',
    position: 'absolute',
    bottom: -20,
  },
});
