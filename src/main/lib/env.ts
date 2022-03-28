import { app } from 'electron'
import isDev from 'electron-is-dev'
import path, { join as joinPath } from 'path'

export const IS_DEV = isDev

const dataDir = '.nftworlds'
const appData = app.getPath('appData')
export const APP_ROOT = IS_DEV
  ? joinPath('.', dataDir)
  : joinPath(appData, dataDir)

const env: IPC.Environment = {
  isDev: IS_DEV,
  appRoot: APP_ROOT,
  appRootAbsolute: path.resolve(APP_ROOT),
}

// @ts-expect-error Global Assign
global.env = env
