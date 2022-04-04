import { ipcRenderer } from 'electron'
import { EventEmitter } from 'eventemitter3'
import { profile as Profile } from 'msmc'

export const convertMemory = (gb: number) => {
  if (gb === 0) return '512M'
  return `${gb}G`
}

export const launch = async (
  profile: Profile,
  options: IPC.LaunchOptions,
  world: NFTWorlds.World,
  worlds: NFTWorlds.World[]
) => {
  await ipcRenderer.invoke('launch:launch', profile, options, world, worlds)
}

interface Events {
  // eslint-disable-next-line @typescript-eslint/ban-types
  open: []
  close: [code: number]
  data: [message: string]
  debug: [message: string]
  update: [message: string, percentage: number]
}

class LaunchEvents extends EventEmitter<Events> {
  constructor() {
    super()

    ipcRenderer.on('launch:@open', () => this.emit('open'))
    ipcRenderer.on('launch:@close', (_, code) => this.emit('close', code))
    ipcRenderer.on('launch:@data', (_, message) => this.emit('data', message))
    ipcRenderer.on('launch:@debug', (_, message) => this.emit('debug', message))
    ipcRenderer.on('launch:@update', (_, message, percentage) =>
      this.emit('update', message, percentage)
    )
  }
}

export const launchEvents = new LaunchEvents()
