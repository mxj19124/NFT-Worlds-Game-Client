import * as remote from '@electron/remote/main'
import { app, BrowserWindow } from 'electron'
import Store from 'electron-store'
import { join as joinPath } from 'path'
import process from 'process'
import { initHandlers } from './ipc/handler'
import { IS_DEV } from './lib/env'

remote.initialize()
Store.initRenderer()

if (!IS_DEV && module.hot) {
  module.hot.accept()
}

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'NFT Worlds',
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

void app.whenReady().then(async () => {
  const { webContents } = await createWindow()
  initHandlers(webContents)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
