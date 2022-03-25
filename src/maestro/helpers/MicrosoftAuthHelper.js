import requestPromise from 'request-promise';
import { Helper } from 'react-native-maestro';

const CLIENT_ID = 'bf51f29d-6a70-4f4e-8cdb-2b358074ad4c';
const DEVICECODE_ENDPOINT = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/devicecode';
const TOKEN_ENDPOINT = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token';
const AUTH_XBL_ENDPOINT = 'https://user.auth.xboxlive.com/user/authenticate';
const AUTH_XSTS_ENDPOINT = 'https://xsts.auth.xboxlive.com/xsts/authorize';
const AUTH_MC_ENDPOINT = 'https://api.minecraftservices.com/authentication/login_with_xbox';
const MC_PROFILE_ENDPOINT = 'https://api.minecraftservices.com/minecraft/profile';
const MC_STORE_ENDPOINT = 'https://api.minecraftservices.com/entitlements/mcstore';

export default class MicrosoftAuthHelper extends Helper {
  static get instanceKey() {
    return 'microsoftAuthHelper';
  }

  async getDeviceCode() {
    const data = {};
    const expiresAt = new Date();

    const response = await requestPromise(DEVICECODE_ENDPOINT, {
      method: 'post',
      formData: {
        client_id: CLIENT_ID,
        scope: 'XboxLive.signin offline_access',
      },
      json: true,
    });

    expiresAt.setSeconds(expiresAt.getSeconds() + response.expires_in);

    data.expiresAt = expiresAt;
    data.deviceCode = response.device_code;
    data.userCode = response.user_code;
    data.verificationUri = response.verification_uri;
    data.interval = response.interval;
    data.message = response.message;

    return data;
  }

  async pollDeviceCode(deviceCode) {
    const data = {};
    const expiresAt = new Date();

    const response = await requestPromise(TOKEN_ENDPOINT, {
      method: 'post',
      formData: {
        client_id: CLIENT_ID,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        device_code: deviceCode,
      },
      json: true,
    });

    expiresAt.setSeconds(expiresAt.getSeconds() + response.expires_in);

    data.expiresAt = expiresAt;
    data.scope = response.scope;
    data.accessToken = response.access_token;
    data.idToken = response.id_token;
    data.refreshToken = response.refresh_token;

    return data;
  }

  // async getAccessToken(authCode) {
  //   const data = {};
  //   const expiresAt = new Date();

  //   const response = await requestPromise(TOKEN_ENDPOINT, {
  //     method: 'post',
  //     formData: {
  //       client_id: CLIENT_ID,
  //       code: authCode,
  //       scope: 'XboxLive.signin',
  //       redirect_uri: 'https://login.microsoftonline.com/common/oauth2/nativeclient',
  //       grant_type: 'authorization_code',
  //     },
  //     json: true,
  //   });

  //   if (response.statusCode !== 200) {
  //     throw new Error(response.statusMessage);
  //   }

  //   expiresAt.setSeconds(expiresAt.getSeconds() + response.body.expires_in);

  //   data.expiresAt = expiresAt;
  //   data.accessToken = response.body.access_token;
  //   data.refreshToken = response.body.refresh_token;

  //   return data;
  // }

  // async refreshAccessToken(refreshToken) {
  //   const data = {};
  //   const expiresAt = new Date();

  //   const response = await requestPromise(TOKEN_ENDPOINT, {
  //     method: 'post',
  //     formData: {
  //       client_id: CLIENT_ID,
  //       refresh_token: refreshToken,
  //       scope: 'XboxLive.signin',
  //       redirect_uri: 'https://login.microsoftonline.com/common/oauth2/nativeclient',
  //       grant_type: 'refresh_token',
  //     },
  //     json: true,
  //   });

  //   if (response.statusCode !== 200) {
  //     throw new Error(response.statusMessage);
  //   }

  //   expiresAt.setSeconds(expiresAt.getSeconds() + response.body.expires_in);

  //   data.expiresAt = expiresAt;
  //   data.accessToken = response.body.access_token;

  //   return data;
  // }

  async authMinecraft(accessToken) {
    const xblToken = await this._getXBLToken(accessToken);
    const xstsToken = await this._getXSTSToken(xblToken.token);
    const minecraftAccessToken = await this._getMinecraftAccessToken(xblToken.uhs, xstsToken);

    return minecraftAccessToken;
  }

  async checkMinecraftStore(accessToken) {
    const response = await requestPromise(MC_STORE_ENDPOINT, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: true,
    });

    const { items } = response;
    return (!!items && items.length > 0);
  }

  async getMinecraftProfile(accessToken) {
    const response = requestPromise(MC_PROFILE_ENDPOINT, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: true,
    });

    return response;
  }

  async _getXBLToken(accessToken) {
    const data = {};

    const response = await requestPromise(AUTH_XBL_ENDPOINT, {
      method: 'post',
      body: {
        Properties: {
          AuthMethod: 'RPS',
          SiteName: 'user.auth.xboxlive.com',
          RpsTicket: `d=${accessToken}`,
        },
        RelyingParty: 'http://auth.xboxlive.com',
        TokenType: 'JWT',
      },
      json: true,
    });

    data.token = response.Token;
    data.uhs = response.DisplayClaims.xui[0].uhs;

    return data;
  }

  async _getXSTSToken(xblToken) {
    const response = await requestPromise(AUTH_XSTS_ENDPOINT, {
      method: 'post',
      body: {
        Properties: {
          SandboxId: 'RETAIL',
          UserTokens: [ xblToken ],
        },
        RelyingParty: 'rp://api.minecraftservices.com/',
        TokenType: 'JWT',
      },
      json: true,
    });

    if (response.XErr === 2148916233) {
      throw new Error('Your Microsoft account is not connected to an Xbox account. Please create one.');
    }

    if (response.XErr === 2148916238) {
      throw new Error('Since you are not yet 18 years old, an adult must add you to a family in order for you to use NFT Worlds!');
    }

    return response.Token;
  }

  async _getMinecraftAccessToken(uhs, xstsToken) {
    const data = {};
    const expiresAt = new Date();

    const response = await requestPromise(AUTH_MC_ENDPOINT, {
      method: 'post',
      body: {
        identityToken: `XBL3.0 x=${uhs};${xstsToken}`,
      },
      json: true,
    });

    expiresAt.setSeconds(expiresAt.getSeconds() + response.expires_in);

    data.accessToken = response.access_token;
    data.expiresAt = expiresAt;

    return data;
  }
}
