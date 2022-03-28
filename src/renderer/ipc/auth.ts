import { ipcRenderer } from 'electron'
import { EventEmitter } from 'eventemitter3'
import msmc, {
  type profile as Profile,
  type result as Result,
  type update as Update,
} from 'msmc'

export const login = async () => {
  const result = (await ipcRenderer.invoke('auth:login')) as Result
  if (msmc.errorCheck(result)) {
    throw new Error(result.reason)
  }

  return result.profile!
}

export const validate = async (profile: Profile) => {
  const result = (await ipcRenderer.invoke('auth:validate', profile)) as boolean
  return result
}

export const refresh = async (profile: Profile) => {
  const result = (await ipcRenderer.invoke('auth:refresh', profile)) as Result
  if (msmc.errorCheck(result)) {
    throw new Error(result.reason)
  }

  return result.profile!
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
