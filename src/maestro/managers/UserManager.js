import { Manager } from 'react-native-maestro';
import { clipboard, shell } from 'electron';

const USER_STORAGE_FILENAME = 'user.json';
const USER_STORE_TEMPLATE = {
  accessToken: null,
  clientToken: null,
  loginMethod: null, // mojang, microsoft
  availableProfiles: [],
  selectedProfile: null,
  user: null,
};

export default class UserManager extends Manager {
  static get instanceKey() {
    return 'userManager';
  }

  static initialStore = { ...USER_STORE_TEMPLATE }

  get storeName() {
    return 'user';
  }

  async loginWithMojang(email, password) {
    const { mojangAuthHelper } = this.maestro.helpers;

    const authResponse = await mojangAuthHelper.authenticate(email, password);

    this.updateStore({
      accessToken: authResponse.accessToken,
      clientToken: authResponse.clientToken,
      loginMethod: 'mojang',
      availableProfiles: authResponse.availableProfiles,
      selectedProfile: authResponse.selectedProfile,
      user: authResponse.user,
    });

    this.saveUserData();
  }

  async loginWithMicrosoft() {
    const { microsoftAuthHelper } = this.maestro.helpers;
    const deviceCodeResponse = await microsoftAuthHelper.getDeviceCode();

    clipboard.writeText(deviceCodeResponse.userCode);
    alert(`${deviceCodeResponse.message}\nThe code has been copied to your clipboard, press OK to continue.`);
    shell.openExternal(deviceCodeResponse.verificationUri);

    const sleep = ms => new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });

    const maxPolls = 30;
    let i = 0;
    let pollResponse;

    console.log(`polling microsoft endpoint every ${deviceCodeResponse.interval} seconds for a maxiumum of ${maxPolls}`);
    do {
      try {
        pollResponse = await microsoftAuthHelper.pollDeviceCode(deviceCodeResponse.deviceCode);

        // success, stop trying
        if (pollResponse !== undefined) break;
      } catch {
        // probably not authenticated yet, retry
      }

      await sleep(deviceCodeResponse.interval * 1000);
      i += 1;
    } while (i < maxPolls);

    if (pollResponse === undefined) {
      throw new Error('Timed out waiting for Microsoft account login!');
    }

    const { accessToken, expiresAt } = await microsoftAuthHelper.authMinecraft(pollResponse.accessToken);
    const store = await microsoftAuthHelper.checkMinecraftStore(accessToken);
    if (!store) {
      throw new Error('You do not own a copy of Minecraft: Java Edition!');
    }

    const profile = await microsoftAuthHelper.getMinecraftProfile(accessToken);
    this.updateStore({
      accessToken: accessToken,
      loginMethod: 'microsoft',
      availableProfiles: [profile],
      selectedProfile: profile,
      user: {},
    });

    this.saveUserData();
  }

  async loadUser() {
    const { storageHelper } = this.maestro.helpers;

    const readUserData = () => {
      try {
        return storageHelper.readJSONFile(USER_STORAGE_FILENAME)
      } catch {
        return {}
      }
    }

    const userData = readUserData();
    const update = {};

    Object.keys(USER_STORE_TEMPLATE).forEach(key => {
      update[key] = userData[key];
    });

    this.updateStore(update);
  }

  async validateOrRefreshUser() {
    const { mojangAuthHelper } = this.maestro.helpers;
    const { accessToken, clientToken } = this.store;
    // TODO: Handle microsoft tokens

    if (!accessToken) {
      throw new Error('No logged in user access token found.');
    }

    const isValid = mojangAuthHelper.validate(accessToken);

    if (!isValid) {
      const refreshResponse = await mojangAuthHelper.refresh(accessToken, clientToken);

      this.updateStore({
        accessToken: refreshResponse.accessToken,
        clientToken: refreshResponse.clientToken,
      });

      this.saveUserData();
    }
  }

  saveUserData() {
    const { storageHelper } = this.maestro.helpers;

    storageHelper.writeJSONFile(USER_STORAGE_FILENAME, this.store);
  }

  getSelectedProfile() {
    return this.store.selectedProfile;
  }

  getGameAccount() {
    const selectedProfile = this.getSelectedProfile();

    return {
      accessToken: this.store.accessToken,
      username: selectedProfile.name,
      uuid: selectedProfile.id,
      displayName: selectedProfile.name,
      type: 'mojang',
    };
  }

  isLoggedIn() {
    return !!this.store.accessToken;
  }

  logout() {
    this.updateStore({ ...USER_STORE_TEMPLATE });
    this.saveUserData();
  }
}
