import fs from 'fs-extra';
import path from 'path';
import { Helper } from 'react-native-maestro';
import { remote } from 'electron';

// Expo overwrites electron's process & process.env
// so we need to make an eager copy at runtime start.
const SYSTEM_PROCESS = Object.assign({}, process);

const SYSTEM_ROOT = remote.app.getPath('appData');
const APP_STORAGE_DIRECTORY = path.join(SYSTEM_ROOT, '.nftworlds');

export default class AppSystemHelper extends Helper {
  static get instanceKey() {
    return 'appSystemHelper';
  }

  constructor(maestro) {
    super(maestro);

    fs.ensureDirSync(APP_STORAGE_DIRECTORY);
  }

  getAppStorageDirectory() {
    return APP_STORAGE_DIRECTORY;
  }

  getAppStorageFilePath(filename) {
    return path.join(APP_STORAGE_DIRECTORY, filename);
  }

  getSystemProcess() {
    return SYSTEM_PROCESS;
  }

  getSystemRoot() {
    return SYSTEM_ROOT;
  }

  getCommonDirectory() {
    return path.join(APP_STORAGE_DIRECTORY, 'common');
  }

  getInstanceDirectory() {
    return path.join(APP_STORAGE_DIRECTORY, 'instances');
  }

  getTempNativeFolder() {
    return 'NFTWNatives';
  }

  getJavaExecutable() {
    return null; // TODO: should return stored executable dir.
  }
}
