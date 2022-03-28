import { ipcMain, type WebContents } from 'electron'
import { login, refresh, validate } from './auth'

export const initHandlers = (webContents: WebContents) => {
  ipcMain.handle('auth:login', async () => login(webContents))
  ipcMain.handle('auth:validate', async (_, profile) => validate(profile))
  ipcMain.handle('auth:refresh', async (_, profile) =>
    refresh(profile, webContents)
  )
}
