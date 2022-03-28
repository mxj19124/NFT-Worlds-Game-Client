import { Buffer } from 'buffer'
import { type WebContents } from 'electron'
import { writeFile } from 'fs/promises'
import { Client, type ILauncherOptions } from 'minecraft-launcher-core'
import mkdirp from 'mkdirp'
import { getMCLC, type profile as Profile } from 'msmc'
import { join as joinPath } from 'path'
import { APP_ROOT } from '../lib/env'
import { generateServersFile, worldToServer } from '../lib/serversDat'

const launcher = new Client()

export type LaunchOptions = IPC.LaunchOptions
export const launch = async (
  profile: Profile,
  options: LaunchOptions,
  world: NFTWorlds.World,
  worlds: NFTWorlds.World[],
  webContents: WebContents

  // eslint-disable-next-line max-params
) => {
  const root = joinPath(APP_ROOT, '.minecraft')
  await mkdirp(root) // Ensure root directory exists

  const servers = worlds.map(world => worldToServer(world))
  const serversDatFile = generateServersFile(servers)

  const serversPath = joinPath(root, 'servers.dat')
  await writeFile(serversPath, Buffer.from(serversDatFile))

  const _options: ILauncherOptions = {
    // @ts-expect-error Incorrect Typings
    authorization: getMCLC().getAuth(profile),
    root,
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
    server: {
      host: world.connection.address,
      port: world.connection.port.toString(),
    },

    customArgs: [
      '-XX:+UnlockExperimentalVMOptions',
      '-XX:+UseG1GC',
      '-XX:G1NewSizePercent=20',
      '-XX:G1ReservePercent=20',
      '-XX:MaxGCPauseMillis=50',
      '-XX:G1HeapRegionSize=32M',
    ],
  }

  launcher.removeAllListeners()
  launcher.on('data', (...args) => webContents.send('launch:@data', ...args))
  launcher.on('debug', (...args) => webContents.send('launch:@debug', ...args))
  launcher.on('close', (...args) => webContents.send('launch:@close', ...args))

  await launcher.launch(_options)
  webContents.send('launch:@open')
}
