import { Manager } from 'react-native-maestro';

const CONFIG_STORAGE_FILENAME = 'config.json';
const CONFIG_STORE_TEMPLATE = {
  java: {
    minRAM: null,
    maxRAM: null,
    executable: null,
    jvmOptions: [
      '-XX:+UseConcMarkSweepGC',
      '-XX:+CMSIncrementalMode',
      '-XX:-UseAdaptiveSizePolicy',
      '-Xmn128M',
    ],
  },
  game: {
    resWidth: 1280,
    resHeight: 720,
    fullscreen: true, //false,
    autoConnect: true,
    launchDetached: true,
    modConfigurations: [],
  },
  launcher: {
    dataDirectory: null,
  },
};

export default class ConfigManager extends Manager {
  static get instanceKey() {
    return 'configManager';
  }

  static initialStore = { ...CONFIG_STORE_TEMPLATE }

  get storeName() {
    return 'config';
  }

  async loadConfig() { // TODO: doesn't deep copy
    const { storageHelper } = this.maestro.helpers;

    const configData = storageHelper.readJSONFile(CONFIG_STORAGE_FILENAME) || {};
    const update = {};

    Object.keys(CONFIG_STORE_TEMPLATE).forEach(key => {
      update[key] = configData[key];
    });
  }

  saveConfigData() {
    const { storageHelper } = this.maestro.helpers;

    storageHelper.writeJSONFile(CONFIG_STORAGE_FILENAME, this.store);
  }

  getAutoConnect() {
    return this.store.game.autoConnect;
  }

  getFullscreen() {
    return this.store.game.fullscreen;
  }

  getGameHeight() {
    return this.store.game.resHeight;
  }

  getGameWidth() {
    return this.store.game.resWidth;
  }

  getJVMOptions() {
    return this.store.java.jvmOptions;
  }

  getMaxRAM() {
    return '4G';
//    return this.store.java.maxRAM;
  }

  getMinRAM() {
    return '4G';
//    return this.store.java.minRAM;
  }

  getLaunchDetached() {
    return this.store.game.launchDetached;
  }

  getModConfiguration() {
    return {
      'main-1.12.2': [],
    };
  }
}
