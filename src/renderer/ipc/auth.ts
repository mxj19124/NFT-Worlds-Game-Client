import { ipcRenderer } from 'electron'
import { EventEmitter } from 'eventemitter3'
import { type profile as Profile, type update as Update } from 'msmc'

export const login = async () => {
  const result = (await ipcRenderer.invoke('auth:login')) as IPC.AuthResult
  return result
}

export const validate = async (profile: Profile) => {
  const result = (await ipcRenderer.invoke('auth:validate', profile)) as boolean
  return result
}

export const refresh = async (profile: Profile) => {
  const result = (await ipcRenderer.invoke(
    'auth:refresh',
    profile
  )) as IPC.AuthResult

  return result
}

interface Events {
  update: [update: Update]
}

class LoginEvents extends EventEmitter<Events> {
  constructor() {
    super()

    ipcRenderer.on('auth:@update', (_, update: Update) =>
      this.emit('update', update)
    )
  }
}

export const loginEvents = new LoginEvents()
