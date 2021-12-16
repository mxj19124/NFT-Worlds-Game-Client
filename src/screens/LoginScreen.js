import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { shell } from 'electron';
import { Button, Heading, TextInputField, ImageButton, LinkText } from '../components';
import maestro from '../maestro';

const { userManager } = maestro.managers;
const { navigationHelper } = maestro.helpers;

export default class LoginScreen extends Component {
  state = {
    email: null,
    password: null,
    loading: false,
  }

  _login = async () => {
    const { email, password } = this.state;

    if (!email || !password) {
      return alert('An email address and password must be provided.');
    }

    this.setState({ loading: true });

    try {
      await userManager.loginWithMojang(email, password);

      navigationHelper.openScreen('home');
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      alert(error.error.errorMessage);
    }
  }

  _loginWithMicrosoft = () => {
    alert('Microsoft sign in is not yet available. Please sign in using a Mojang account.');
  }

  _openForgotPassword = () => {
    shell.openExternal('hattps://www.minecraft.net/password/forgot');
  }

  _openCreateAccount = () => {
    shell.openExternal('https://www.minecraft.net/store/minecraft-java-edition');
  }

  _openNFTWorlds = () => {
    shell.openExternal('https://www.nftworlds.com');
  }

  render() {
    const { loading } = this.state;

    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png').default}
          resizeMode={'contain'}
          style={styles.logoImage}
        />

        <View style={styles.loginForm}>
          <Heading uppercase style={styles.heading}>Minecraft Login</Heading>
          <Text style={styles.infoText}>Your Mojang account is used to login.</Text>

          <TextInputField
            onChangeText={email => this.setState({ email })}
            placeholder={'Email Address'}
            textInputStyle={styles.textInputText}
            style={styles.textInput}
          />

          <TextInputField
            onChangeText={password => this.setState({ password })}
            placeholder={'Password'}
            secureTextEntry
            textInputStyle={styles.textInputText}
            style={styles.textInput}
          />

          <Button onPress={this._login} loading={loading}>Login</Button>
        </View>

        <View style={styles.linksContainer}>
          <LinkText onPress={this._openForgotPassword}>forgot password?</LinkText>
          <LinkText onPress={this._openCreateAccount}>need an account?</LinkText>
        </View>

        <ImageButton
          onPress={this._loginWithMicrosoft}
          source={require('../assets/images/microsoft-login.svg').default}
          imageStyle={styles.microsoftLoginImage}
          style={styles.microsoftLoginButton}
        />

        <Text style={[ styles.infoText, styles.disclaimerText ]}>NFT Worlds is not affiliated with Mojang AB or Microsoft.</Text>
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
  disclaimerText: {
    bottom: -20,
    color: '#666666',
    position: 'absolute',
  },
  heading: {
    marginBottom: 2,
    textAlign: 'center',
  },
  infoText: {
    color: '#CCCCCC',
    fontFamily: 'regular',
    fontSize: 10,
    marginBottom: 30,
    textAlign: 'center',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    width: 250,
  },
  loginForm: {
    backgroundColor: '#00000088',
    borderRadius: 3,
    marginTop: 30,
    minWidth: 270,
    padding: 30,
  },
  logoImage: {
    height: 42,
    width: 300,
  },
  microsoftLoginButton: {
    alignSelf: 'center',
    marginTop: 15,
    minWidth: 190,
  },
  microsoftLoginImage: {
    height: 35,
  },
  textInput: {
    marginBottom: 30,
  },
  textInputText: {
    textAlign: 'center',
  },
  visitLink: {
    alignSelf: 'center',
    marginTop: 10,
  },
});
