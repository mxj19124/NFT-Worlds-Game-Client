import { app, BrowserWindow } from 'electron'
import { join as joinPath } from 'path'
import process from 'process'

const isDevelopment = process.env.NODE_ENV !== 'production'

if (!isDevelopment && module.hot) {
  module.hot.accept()
}

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  win.removeMenu()

  if (isDevelopment) {
    win.webContents.openDevTools()

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
  return win
}

void app.whenReady().then(async () => {
  await createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
