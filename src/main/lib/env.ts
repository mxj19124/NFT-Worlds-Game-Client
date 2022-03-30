import { app } from 'electron'
import isDev from 'electron-is-dev'
import path, { join as joinPath } from 'path'

export const IS_DEV = isDev

const dataDir = '.nftworlds'
const appData = app.getPath('appData')
export const APP_ROOT = IS_DEV
  ? joinPath('.', dataDir)
  : joinPath(appData, dataDir)

export const APP_ROOT_ABSOLUTE = path.resolve(APP_ROOT)
const env: IPC.Environment = {
  isDev: IS_DEV,
  appRoot: APP_ROOT,
  appRootAbsolute: APP_ROOT_ABSOLUTE,
}

// @ts-expect-error Global Assign
global.env = env
