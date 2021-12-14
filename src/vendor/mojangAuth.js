import requestPromise from 'request-promise';

// Constants
const AUTH_BASE_URI = 'https://authserver.mojang.com';
const MINECRAFT_AGENT = {
  name: 'Minecraft',
  version: 1,
};

/**
 * Exports
 */

export async function authenticate(username, password, clientToken, requestUser = true, agent = MINECRAFT_AGENT) {
  const response = await requestPromise(`${AUTH_BASE_URI}/authenticate`, {
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

  if (response.statusCode !== 200) {
    throw new Error(response.body);
  }

  return response.body;
}

export async function validate(accessToken, clientToken) {
  const response = await requestPromise(`${AUTH_BASE_URI}/validate`, {
    method: 'post',
    body: {
      accessToken,
      clientToken,
    },
    json: true,
  });

  if (response.statusCode !== 204) {
    throw new Error(response.body);
  }

  return true;
}

export async function invalidate(accessToken, clientToken) {
  const response = await requestPromise(`${AUTH_BASE_URI}/invalidate`, {
    method: 'post',
    body: {
      accessToken,
      clientToken,
    },
    json: true,
  });

  if (response.statusCode !== 204) {
    throw new Error(response.body);
  }

  return true;
}

export async function refresh(accessToken, clientToken, requestUser = true) {
  const response = await requestPromise(`${AUTH_BASE_URI}/refresh`, {
    method: 'post',
    body: {
      accessToken,
      clientToken,
      requestUser,
    },
    json: true,
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body);
  }

  return response.body;
}
