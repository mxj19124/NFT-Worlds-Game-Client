import { copyFile, readFile, writeFile } from 'fs/promises'
import mkdirp from 'mkdirp'
import { join as joinPath, parse } from 'path'
import { APP_ROOT } from './env'
import { downloadCachedAsset, exists } from './http'

export type AssetType = typeof assetTypes[number]
const assetTypes = ['mod', 'resourcepack', 'shaderpack'] as const

export type Asset = readonly [type: AssetType, url: string]
export interface CachedAsset {
  filename: string
  cachedPath: string
  type: AssetType
}

const assets: readonly Asset[] = [
  [
    'mod',
    'https://cdn.modrinth.com/data/P7dR8mSH/versions/0.48.0+1.18.2/fabric-api-0.48.0%2B1.18.2.jar',
  ],
  [
    'mod',
    'https://cdn.modrinth.com/data/gvQqBUqZ/versions/mc1.18.2-0.7.9/lithium-fabric-mc1.18.2-0.7.9.jar',
  ],
  [
    'mod',
    'https://cdn.modrinth.com/data/YL57xq9U/versions/1.18.x-v1.2.2/iris-mc1.18.2-1.2.2-build.32.jar',
  ],
  [
    'mod',
    'https://cdn.modrinth.com/data/AANobbMI/versions/mc1.18.2-0.4.1/sodium-fabric-mc1.18.2-0.4.1%2Bbuild.15.jar',
  ],

  ['shaderpack', 'https://media.forgecdn.net/files/3608/184/BSL_v8.1.02.1.zip'],
]

const assetCache = joinPath(APP_ROOT, '.assetcache')
export const fetchAssets = async () =>
  Promise.all(
    assets.map(async ([type, url]) => {
      const cachedPath = await downloadCachedAsset(assetCache, url)

      const asset: CachedAsset = {
        filename: parse(cachedPath).base,
        cachedPath,
        type,
      }

      return asset
    })
  )

const syncShaderPack: (
  root: string,
  pack: string | undefined
) => Promise<void> = async (root, pack) => {
  const configFile = joinPath(root, 'config', 'iris.properties')
  const configExists = await exists(configFile)

  const targetLine = 'shaderPack='
  const newLine = pack ? `${targetLine}${pack}` : targetLine

  const newLines: string[] = []
  if (configExists) {
    const text = await readFile(configFile, 'utf-8')
    const lines = text.split('\n')

    let replaced = false
    for (const line of lines) {
      if (!line.startsWith(targetLine)) {
        newLines.push(line)
        continue
      }

      newLines.push(newLine)
      replaced = true
    }

    if (!replaced) {
      newLines.push(newLine)
    }
  } else {
    newLines.push(newLine)
  }

  const data = newLines.join('\n')
  await writeFile(configFile, data)
}

export const syncAssets = async (
  root: string,
  assets: readonly CachedAsset[],
  options: IPC.LaunchOptions
) => {
  // TODO: Cleanup old mods
  // TODO: Select resourcepack if applicable

  await Promise.all(
    assets.map(async ({ filename, cachedPath, type }) => {
      const dir = joinPath(root, `${type}s`)
      await mkdirp(dir)

      const filepath = joinPath(dir, filename)
      await copyFile(cachedPath, filepath)
    })
  )

  const shaderPack = options.enableShaders
    ? assets.find(x => x.type === 'shaderpack')?.filename
    : undefined

  await syncShaderPack(root, shaderPack)
}
