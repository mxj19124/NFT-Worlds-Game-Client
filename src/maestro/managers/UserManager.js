import { Manager } from 'react-native-maestro';

const USER_STORAGE_FILENAME = 'user.json';
const USER_STORE_TEMPLATE = {
  accessToken: null,
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
      loginMethod: 'mojang',
      availableProfiles: authResponse.availableProfiles,
      selectedProfile: authResponse.selectedProfile,
      user: authResponse.user,
    });

    this.saveUserData();
  }

  async loginWithMicrosoft() {
    
  }

  async loadUser() {
    const { storageHelper } = this.maestro.helpers;

    const userData = storageHelper.readJSONFile(USER_STORAGE_FILENAME) || {};
    const update = {};

    Object.keys(USER_STORE_TEMPLATE).forEach(key => {
      update[key] = userData[key];
    });

    this.updateStore(update);
  }

  saveUserData() {
    const { storageHelper } = this.maestro.helpers;

    storageHelper.writeJSONFile(USER_STORAGE_FILENAME, this.store);
  }

  getSelectedProfile() {
    return this.store.selectedProfile;
  }

  isLoggedIn() {
    return !!this.store.accessToken;
  }

  logout() {
    this.updateStore({ ...USER_STORE_TEMPLATE });
    this.saveUserData();
  }
}
