import { app } from 'electron'
import isDev from 'electron-is-dev'
import { totalmem } from 'os'
import path, { join as joinPath } from 'path'
import { sync as readPkg } from 'read-pkg-up'

export const IS_DEV = isDev
export const VERSION = readPkg()?.packageJson.version ?? app.getVersion()

const dataDir = '.nftworlds'
const appData = app.getPath('appData')
export const APP_ROOT = IS_DEV
  ? joinPath('.', dataDir)
  : joinPath(appData, dataDir)

export const APP_ROOT_ABSOLUTE = path.resolve(APP_ROOT)
const env: IPC.Environment = {
  isDev: IS_DEV,
  version: VERSION,
  appRoot: APP_ROOT,
  appRootAbsolute: APP_ROOT_ABSOLUTE,
  maxMemoryGB: Math.round(totalmem() / 1024 ** 3),
}

// @ts-expect-error Global Assign
global.env = env
