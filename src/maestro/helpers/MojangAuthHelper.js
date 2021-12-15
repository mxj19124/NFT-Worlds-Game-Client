import { Helper } from 'react-native-maestro';
import requestPromise from 'request-promise';

const AUTH_BASE_URI = 'https://authserver.mojang.com';
const MINECRAFT_AGENT = {
  name: 'Minecraft',
  version: 1,
};

export default class MojangAuthHelper extends Helper {
  static get instanceKey() {
    return 'mojangAuthHelper';
  }

  async authenticate(username, password, clientToken, requestUser = true, agent = MINECRAFT_AGENT) {
    return requestPromise(`${AUTH_BASE_URI}/authenticate`, {
      method: 'post',
      body: {
        agent,
        username,
        password,
        requestUser,
        clientToken: clientToken || undefined,
      },
      json: true,
    });
  }

  async validate(accessToken, clientToken) {
    await requestPromise(`${AUTH_BASE_URI}/validate`, {
      method: 'post',
      body: {
        accessToken,
        clientToken,
      },
      json: true,
    });

    return true;
  }

  async invalidate(accessToken, clientToken) {
    await requestPromise(`${AUTH_BASE_URI}/invalidate`, {
      method: 'post',
      body: {
        accessToken,
        clientToken,
      },
      json: true,
    });

    return true;
  }

  async refresh(accessToken, clientToken, requestUser = true) {
    return requestPromise(`${AUTH_BASE_URI}/refresh`, {
      method: 'post',
      body: {
        accessToken,
        clientToken,
        requestUser,
      },
      json: true,
    });
  }
}
