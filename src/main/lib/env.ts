import { app } from 'electron'
import { join as joinPath } from 'path'
import process from 'process'

export const isDevelopment = process.env.NODE_ENV !== 'production'

const dataDir = '.nftworlds'
const appData = app.getPath('appData')
export const APP_ROOT = isDevelopment
  ? joinPath('.', dataDir)
  : joinPath(appData, dataDir)

const env: IPC.Environment = {
  isDev: isDevelopment,
  appRoot: APP_ROOT,
}

// @ts-expect-error Global Assign
global.env = env
