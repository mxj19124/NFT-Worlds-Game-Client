import 'source-map-support/register'

import * as remote from '@electron/remote/main'
import { app, BrowserWindow, dialog } from 'electron'
import log from 'electron-log'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'
import { join as joinPath } from 'path'
import process from 'process'
import { initHandlers } from './ipc/handler'
import { getSecureKey } from './lib/encryption'
import { APP_ROOT, IS_DEV, VERSION } from './lib/env'
import { exists } from './lib/http'

if (!IS_DEV && module.hot) {
  module.hot.accept()
}

if (process.platform === 'win32') {
  app.setAppUserModelId('NFT Worlds')
}

const instanceLock = app.requestSingleInstanceLock()
if (!instanceLock) app.quit()

Object.assign(console, log.functions)
log.transports.file.resolvePath = () => joinPath(APP_ROOT, 'logs', 'main.log')

autoUpdater.autoDownload = false
autoUpdater.logger = log

remote.initialize()
Store.initRenderer()

const createWindow = async () => {
  const win = new BrowserWindow({
    title: `NFT Worlds v${VERSION}`,

    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  win.removeMenu()
  remote.enable(win.webContents)

  const load = async () => {
    if (IS_DEV) {
      const port = process.env.ELECTRON_WEBPACK_WDS_PORT
      if (!port) {
        throw new Error('Webpack Port is undefined!')
      }

      await win.loadURL(`http://localhost:${port}`)
    } else {
      const path = joinPath(__dirname, 'index.html')
      await win.loadURL(`file://${path}`)
    }

    win.focus()
    if (IS_DEV) {
      win.webContents.openDevTools()
    }
  }

  return { win, load }
}

const checkForUpdates = async () => {
  if (IS_DEV) return false

  const noUpdateFile = joinPath(APP_ROOT, '.noupdate')
  const noUpdate = await exists(noUpdateFile)
  if (noUpdate) return false

  const updates = await autoUpdater.checkForUpdates()
  if (updates === null) return false

  return updates.cancellationToken !== undefined
}

void app.whenReady().then(async () => {
  const updateCheckJob = checkForUpdates()

  // @ts-expect-error Global Assign
  global.__SECURE_STORE_KEY = getSecureKey()

  const { win, load } = await createWindow()
  initHandlers(win.webContents)
  await load()

  autoUpdater.on('download-progress', ({ percent }) => {
    win.setProgressBar(percent / 100, { mode: 'normal' })
  })

  autoUpdater.on('update-downloaded', async () => {
    win.setProgressBar(-1)

    const { response } = await dialog.showMessageBox(win, {
      type: 'info',
      title: win.title,
      message: 'Update Available',
      detail:
        'An update has been downloaded, restart the client to finish installing.',
      buttons: ['Restart Now', 'Restart Later'],
      cancelId: 1,
    })

    if (response === 0) app.quit()
  })

  const hasUpdate = await updateCheckJob
  if (hasUpdate) void autoUpdater.downloadUpdate()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
