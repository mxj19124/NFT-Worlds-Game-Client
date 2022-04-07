import 'source-map-support/register'

import * as remote from '@electron/remote/main'
import { app, BrowserWindow, Notification } from 'electron'
import log from 'electron-log'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'
import { join as joinPath } from 'path'
import process from 'process'
import { initHandlers } from './ipc/handler'
import { APP_ROOT, IS_DEV } from './lib/env'
import { exists } from './lib/http'

if (!IS_DEV && module.hot) {
  module.hot.accept()
}

if (process.platform === 'win32') {
  app.setAppUserModelId('NFT Worlds')
}

Object.assign(console, log.functions)
log.transports.file.resolvePath = () => joinPath(APP_ROOT, 'logs', 'main.log')

autoUpdater.autoDownload = false
autoUpdater.logger = log

remote.initialize()
Store.initRenderer()

const createWindow = async () => {
  const win = new BrowserWindow({
    title: 'NFT Worlds',

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

  return win
}

const checkForUpdates = async () => {
  if (IS_DEV) return false

  const noUpdateFile = joinPath(APP_ROOT, '.noupdate')
  const noUpdate = await exists(noUpdateFile)
  if (noUpdate) return false

  const updates = await autoUpdater.checkForUpdates()
  return updates.cancellationToken !== undefined
}

void app.whenReady().then(async () => {
  const updateCheckJob = checkForUpdates()

  const win = await createWindow()
  initHandlers(win.webContents)

  autoUpdater.on('download-progress', ({ percent }) => {
    win.setProgressBar(percent / 100, { mode: 'normal' })
  })

  autoUpdater.on('update-downloaded', () => {
    win.setProgressBar(-1)

    const notification = new Notification({
      title: 'Update Available',
      body: 'An update has been downloaded, restart the client to finish installing.',
    })

    notification.show()
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
