import { type WebContents } from 'electron'
import { Client, type ILauncherOptions } from 'minecraft-launcher-core'
import { getMCLC, type profile as Profile } from 'msmc'

const launcher = new Client()

export interface LaunchOptions {
  version: string

  width?: number
  height?: number
  fullscreen?: boolean

  memory: ILauncherOptions['memory']
  server?: ILauncherOptions['server']
}

export const launch = async (
  profile: Profile,
  options: LaunchOptions,
  webContents: WebContents
) => {
  // @ts-expect-error Incorrect Typings
  const authorization = getMCLC().getAuth(profile)

  const _options: ILauncherOptions = {
    clientPackage: undefined,
    // @ts-expect-error Incorrect Typings
    authorization,
    root: './minecraft',
    version: {
      number: options.version,
      type: 'release',
    },
    window: {
      width: options.width,
      height: options.height,
      fullscreen: options.fullscreen,
    },
    memory: options.memory,
    server: options.server,
  }

  launcher.removeAllListeners()
  launcher.on('data', (...args) => webContents.send('launch:@data', ...args))
  launcher.on('debug', (...args) => webContents.send('launch:@debug', ...args))
  launcher.on('close', (...args) => webContents.send('launch:@close', ...args))

  await launcher.launch(_options)
  webContents.send('launch:@open')
}
