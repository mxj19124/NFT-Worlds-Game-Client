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
    fullscreen: false,
    autoConnect: true,
    launchDetached: true,
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
}
