import { ipcRenderer } from 'electron'
import { EventEmitter } from 'eventemitter3'
import { profile as Profile } from 'msmc'

export const launch = async (profile: Profile, options: IPC.LaunchOptions) => {
  await ipcRenderer.invoke('launch:launch', profile, options)
}

interface Events {
  // eslint-disable-next-line @typescript-eslint/ban-types
  open: []
  close: [code: number]
  data: [message: string]
  debug: [message: string]
}

class LaunchEvents extends EventEmitter<Events> {
  constructor() {
    super()

    ipcRenderer.on('launch:@open', () => this.emit('open'))
    ipcRenderer.on('launch:@close', (_, code) => this.emit('close', code))
    ipcRenderer.on('launch:@data', (_, message) => this.emit('data', message))
    ipcRenderer.on('launch:@debug', (_, message) => this.emit('debug', message))
  }
}

export const launchEvents = new LaunchEvents()
