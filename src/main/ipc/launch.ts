import { Buffer } from 'buffer'
import { type WebContents } from 'electron'
import { writeFile } from 'fs/promises'
import { Client, type ILauncherOptions } from 'minecraft-launcher-core'
import mkdirp from 'mkdirp'
import { getMCLC, type profile as Profile } from 'msmc'
import path, { join as joinPath } from 'path'
import process from 'process'
import { fetchAssets, syncAssets } from '../lib/assets'
import { APP_ROOT } from '../lib/env'
import { downloadFabric } from '../lib/fabric'
import { exists } from '../lib/http'
import { ensureJava } from '../lib/java'
import { patchM1Version } from '../lib/m1'
import { generateServersFile, worldToServer } from '../lib/serversDat'

const launcher = new Client()

const LAUNCH_STEPS = 8
const MINECRAFT_VERSION = '1.18.2' as const
const MIN_JAVA_VERSION = 17 as const

export type LaunchOptions = IPC.LaunchOptions
export const launch = async (
  profile: Profile,
  options: LaunchOptions,
  world: NFTWorlds.World,
  worlds: NFTWorlds.World[],
  webContents: WebContents

  // eslint-disable-next-line max-params
) => {
  try {
    const java = await ensureJava(webContents, MIN_JAVA_VERSION, LAUNCH_STEPS)
    if (java === undefined) {
      webContents.send('launch:@close', -1)
      return
    }

    if (java.version < MIN_JAVA_VERSION) {
      throw new Error('incompatible java version')
    }

    const root = joinPath(APP_ROOT, '.minecraft')
    await mkdirp(root) // Ensure root directory exists

    const servers = worlds.map(world => worldToServer(world))
    const serversDatFile = generateServersFile(servers)

    const serversPath = joinPath(root, 'servers.dat')
    await writeFile(serversPath, Buffer.from(serversDatFile))

    webContents.send('launch:@update', 'Downloading Fabric', 3 / LAUNCH_STEPS)
    const fabricVersion = await downloadFabric(root, MINECRAFT_VERSION)

    if (process.platform === 'darwin' && process.arch !== 'arm64') {
      webContents.send(
        'launch:@update',
        'Patching Minecraft to work on Apple Silicon',
        4 / LAUNCH_STEPS
      )

      const versionDir = joinPath(root, 'versions', fabricVersion)
      await patchM1Version(MINECRAFT_VERSION, versionDir)
    }

    webContents.send(
      'launch:@update',
      'Downloading Mods and Resources',
      5 / LAUNCH_STEPS
    )

    const assets = await fetchAssets()
    await syncAssets(root, assets, options)

    const _options: ILauncherOptions = {
      // @ts-expect-error Incorrect Typings
      authorization: getMCLC().getAuth(profile),
      root,
      version: {
        number: MINECRAFT_VERSION,
        type: 'release',
        custom: fabricVersion,
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

      javaPath:
        java.type === 'global' ? undefined : path.resolve(java.javaPath),

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
    launcher.on('debug', (...args) =>
      webContents.send('launch:@debug', ...args)
    )

    launcher.on(
      'progress',
      (data: { type: string; task: number; total: number }) => {
        const type = data.type.replace(/-/g, ' ')
        const { task, total } = data

        webContents.send('launch:@progress', type, task, total)
      }
    )

    launcher.on('close', (...args) =>
      webContents.send('launch:@close', ...args)
    )

    launcher.on('data', (message: string) => {
      if (message.includes('Hardware information:')) {
        webContents.send('launch:@open')
      }
    })

    const libsDir = joinPath(root, 'libraries')
    const libsExists = await exists(libsDir)
    if (!libsExists) {
      webContents.send(
        'launch:@update',
        'Downloading Minecraft',
        6 / LAUNCH_STEPS
      )
    }

    await launcher.launch(_options)
    webContents.send('launch:@update', 'Launching Minecraft', 7 / LAUNCH_STEPS)
  } catch (error: unknown) {
    webContents.send('launch:@close', -1)
    throw error
  }
}
