import fs from 'fs-extra';
import { Helper } from 'react-native-maestro';

export default class StorageHelper extends Helper {
  static get instanceKey() {
    return 'storageHelper';
  }

  writeJSONFile(filename, object) {
    const { appSystemHelper } = this.maestro.helpers;
    const filePath = appSystemHelper.getAppStorageFilePath(filename);
    const json = JSON.stringify(object);

    fs.writeFileSync(filePath, json);
  }

  async writeBinaryFile(filename, buffer) {
    const { appSystemHelper } = this.maestro.helpers;
    const filePath = appSystemHelper.getAppStorageFilePath(filename);

    fs.writeFileSync(filePath, buffer);
  }

  readJSONFile(filename) {
    const { appSystemHelper } = this.maestro.helpers;
    const filePath = appSystemHelper.getAppStorageFilePath(filename);

    return JSON.parse(fs.readFileSync(filePath).toString());
  }
}
