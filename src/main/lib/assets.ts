import { copyFile } from 'fs/promises'
import mkdirp from 'mkdirp'
import { join as joinPath, parse } from 'path'
import { APP_ROOT } from './env'
import { downloadCachedAsset } from './http'

export type AssetType = typeof assetTypes[number]
const assetTypes = ['mod', 'resourcepack', 'shaderpack'] as const

export type Asset = readonly [type: AssetType, url: string]
export interface CachedAsset {
  filename: string
  cachedPath: string
  type: string
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

export const syncAssets = async (
  root: string,
  assets: readonly CachedAsset[]
) => {
  // TODO: Cleanup old mods
  // TODO: Select shaderpack if applicable
  // TODO: Select resourcepack if applicable

  await Promise.all(
    assets.map(async ({ filename, cachedPath, type }) => {
      const dir = joinPath(root, `${type}s`)
      await mkdirp(dir)

      const filepath = joinPath(dir, filename)
      await copyFile(cachedPath, filepath)
    })
  )
}
