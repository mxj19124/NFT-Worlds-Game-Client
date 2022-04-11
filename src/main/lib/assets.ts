import { createHash } from 'crypto'
import { copyFile, readdir, readFile, unlink, writeFile } from 'fs/promises'
import mkdirp from 'mkdirp'
import { join as joinPath, parse } from 'path'
import { APP_ROOT } from './env'
import { downloadCachedAsset, exists } from './http'

export type AssetType = typeof assetTypes[number]
const assetTypes = ['mod', 'resourcepack', 'shaderpack'] as const

export interface Asset {
  type: AssetType
  url: string
  sha1: string
}

export interface CachedAsset {
  type: AssetType
  filename: string
  cachedPath: string
  sha1: string
}

const assets: readonly Asset[] = [
  {
    type: 'mod',
    url: 'https://cdn.modrinth.com/data/P7dR8mSH/versions/0.50.0+1.18.2/fabric-api-0.50.0+1.18.2.jar',
    sha1: '994c82605fb3fd247791456a8271abd3e6f17a6f',
  },
  {
    type: 'mod',
    url: 'https://cdn.modrinth.com/data/gvQqBUqZ/versions/mc1.18.2-0.7.9/lithium-fabric-mc1.18.2-0.7.9.jar',
    sha1: '2f0298476ba54e8fc640c9bfe132a193db45b92b',
  },
  {
    type: 'mod',
    url: 'https://cdn.modrinth.com/data/YL57xq9U/versions/1.18.x-v1.2.2/iris-mc1.18.2-1.2.2-build.32.jar',
    sha1: '4f414abe310173ea7e270e26dafec8e6c442b9d4',
  },
  {
    type: 'mod',
    url: 'https://cdn.modrinth.com/data/AANobbMI/versions/mc1.18.2-0.4.1/sodium-fabric-mc1.18.2-0.4.1+build.15.jar',
    sha1: 'f839863a6be7014b8d80058ea1f361521148d049',
  },
  {
    type: 'mod',
    url: 'https://media.forgecdn.net/files/3739/537/3dskinlayers-fabric-1.4.3-mc1.18.2.jar',
    sha1: 'e9696fdbbe0306913134baff0c1cd6a49eeffc68',
  },
  {
    type: 'shaderpack',
    url: 'https://media.forgecdn.net/files/3726/264/BSL_v8.1.02.2.zip',
    sha1: '6fe6b8c743ed3b29642e1c712bd47954466a13d5',
  },
]

const assetCache = joinPath(APP_ROOT, '.assetcache')
export const fetchAssets = async () =>
  Promise.all(
    assets.map(async ({ type, url, sha1 }) => {
      const cachedPath = await downloadCachedAsset(assetCache, url, sha1)

      const asset: CachedAsset = {
        type,
        filename: parse(cachedPath).base,
        cachedPath,
        sha1,
      }

      return asset
    })
  )

const syncShaderPack: (
  root: string,
  pack: string | undefined
) => Promise<void> = async (root, pack) => {
  const configDir = joinPath(root, 'config')
  await mkdirp(configDir)

  const configFile = joinPath(configDir, 'iris.properties')
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
  // TODO: Select resourcepack if applicable

  await Promise.all(
    assets.map(async ({ filename, cachedPath, type }) => {
      const dir = joinPath(root, `${type}s`)
      await mkdirp(dir)

      const filepath = joinPath(dir, filename)
      await copyFile(cachedPath, filepath)
    })
  )

  const hashes = new Set(assets.map(({ sha1 }) => sha1))
  await Promise.all(
    assetTypes.map(async type => {
      const dir = joinPath(root, `${type}s`)
      await mkdirp(dir)

      const files = await readdir(dir)
      await Promise.all(
        files.map(async file => {
          const path = joinPath(dir, file)
          const hash = createHash('sha1')

          const data = await readFile(path)
          hash.update(data)

          const digest = hash.digest('hex')
          const keep = hashes.has(digest)

          if (!keep) await unlink(path)
        })
      )
    })
  )

  const shaderPack = options.enableShaders
    ? assets.find(x => x.type === 'shaderpack')?.filename
    : undefined

  await syncShaderPack(root, shaderPack)
}
