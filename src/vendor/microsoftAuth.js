import requestPromise from 'request-promise';

// Constants
const CLIENT_ID = '';
const TOKEN_ENDPOINT = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token';
const AUTH_XBL_ENDPOINT = 'https://user.auth.xboxlive.com/user/authenticate';
const AUTH_XSTS_ENDPOINT = 'https://xsts.auth.xboxlive.com/xsts/authorize';
const AUTH_MC_ENDPOINT = 'https://api.minecraftservices.com/authentication/login_with_xbox';
const MC_PROFILE_ENDPOINT = 'https://api.minecraftservices.com/minecraft/profile';
const MC_STORE_ENDPOINT = 'https://api.minecraftservices.com/entitlements/mcstore';

const clientId = '0c7c8228-98ff-4ed8-ae28-af41852ba6ab';

async function _getXBLToken(accessToken) {
  const data = {};

  const response = await requestPromise(AUTH_XBL_ENDPOINT, {
    method: 'post',
    json: {
      Properties: {
        AuthMethod: 'RPS',
        SiteName: 'user.auth.xboxlive.com',
        RpsTicket: `d=${accessToken}`,
      },
      RelyingParty: 'http://auth.xboxlive.com',
      TokenType: 'JWT',
    },
  });

  if (response.statusCode !== 200) {
    throw new Error(response.statusMessage);
  }

  data.token = response.body.token;
  data.uhs = response.body.DisplayClaims.xui[0].uhs;

  return data;
}

async function _getXSTSToken(XBLToken) {
  const response = await requestPromise(AUTH_XSTS_ENDPOINT, {
    method: 'post',
    json: {
      Properties: {
        SandboxId: 'RETAIL',
        UserTokens: [ XBLToken ],
      },
      RelyingParty: 'rp://api.minecraftservices.com/',
      TokenType: 'JWT',
    },
  });

  if (response.statusCode !== 200) {
    throw new Error(response.statusMessage);
  }

  if (response.body.XErr === 2148916233) {
    throw new Error('Your Microsoft account is not connected to an Xbox account. Please create one.');
  }

  if (response.body.XErr === 2148916238) {
    throw new Error('Since you are not yet 18 years old, an adult must add you to a family in order for you to use NFT Worlds!');
  }

  return response.body.Token;
}

async function _getMinecraftAccessToken(UHS, XSTSToken) {
  const data = {};
  const expiresAt = new Date();

  const response = await requestPromise(AUTH_MC_ENDPOINT, {
    method: 'post',
    json: {
      identityToken: `XBL3.0 x=${UHS};${XSTSToken}`,
    },
  });

  if (response.statusCode !== 200) {
    throw new Error(response.statusMessage);
  }

  expiresAt.setSeconds(expiresAt.getSeconds() + response.body.expires_in);

  data.accessToken = response.body.access_token;
  data.expiresAt = expiresAt;

  return data;
}

/**
 * Exports
 */

export async function getAccessToken(authCode) {
  const data = {};
  const expiresAt = new Date();

  const response = await requestPromise(TOKEN_ENDPOINT, {
    method: 'post',
    formData: {
      client_id: clientId,
      code: authCode,
      scope: 'XboxLive.signin',
      redirect_uri: 'https://login.microsoftonline.com/common/oauth2/nativeclient',
      grant_type: 'authorization_code',
    },
    json: true,
  });

  if (response.statusCode !== 200) {
    throw new Error(response.statusMessage);
  }

  expiresAt.setSeconds(expiresAt.getSeconds() + response.body.expires_in);

  data.expiresAt = expiresAt;
  data.accessToken = response.body.access_token;
  data.refreshToken = response.body.refresh_token;

  return data;
}

export async function refreshAccessToken(refreshToken) {
  const data = {};
  const expiresAt = new Date();

  const response = await requestPromise(TOKEN_ENDPOINT, {
    method: 'post',
    formData: {
      client_id: clientId,
      refresh_token: refreshToken,
      scope: 'XboxLive.signin',
      redirect_uri: 'https://login.microsoftonline.com/common/oauth2/nativeclient',
      grant_type: 'refresh_token',
    },
    json: true,
  });

  if (response.statusCode !== 200) {
    throw new Error(response.statusMessage);
  }

  expiresAt.setSeconds(expiresAt.getSeconds() + response.body.expires_in);

  data.expiresAt = expiresAt;
  data.accessToken = response.body.access_token;

  return data;
}

export async function authMinecraft(accessToken) {
  const xblToken = await _getXBLToken(accessToken);
  const xstsToken = await _getXSTSToken(xblToken.token);
  const minecraftAccessToken = await _getMinecraftAccessToken(xblToken.uhs, xstsToken);

  return minecraftAccessToken;
}

export async function checkMinecraftStore(accessToken) {
  const response = await requestPromise(MC_STORE_ENDPOINT, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    json: true,
  });

  if (response.statusCode !== 200) {
    throw new Error(response.statusMessage);
  }

  const { items } = response.body;

  return (!!items && items.length > 0);
}

export async function getMinecraftProfile(accessToken) {
  const response = requestPromise(MC_PROFILE_ENDPOINT, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    json: true,
  });

  return response.body;
}
