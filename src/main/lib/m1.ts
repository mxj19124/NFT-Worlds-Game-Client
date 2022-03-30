import axios from 'axios'
import { type Buffer } from 'buffer'
import { createHash } from 'crypto'
import { readFile, writeFile } from 'fs/promises'
import mkdirp from 'mkdirp'
import { join as joinPath } from 'path'
import process from 'process'
import { exists } from './http'

interface AssetPatch {
  url: string
  sha1?: string
  size?: number
}

interface LibraryPatch {
  newVersion: string
  artifact: AssetPatch
  native: AssetPatch
}

const patches: Record<string, LibraryPatch> = {
  lwjgl: {
    newVersion: '3.3.0',
    artifact: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl.jar',
    },
    native: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl-natives-macos-arm64.jar',
    },
  },
  'lwjgl-opengl': {
    newVersion: '3.3.0',
    artifact: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl-opengl.jar',
    },
    native: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl-opengl-natives-macos-arm64.jar',
    },
  },
  'lwjgl-openal': {
    newVersion: '3.3.0',
    artifact: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl-openal.jar',
    },
    native: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl-openal-natives-macos-arm64.jar',
    },
  },
  'lwjgl-jemalloc': {
    newVersion: '3.3.0',
    artifact: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl-jemalloc.jar',
    },
    native: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl-jemalloc-natives-macos-arm64.jar',
    },
  },
  'lwjgl-stb': {
    newVersion: '3.3.0',
    artifact: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl-stb.jar',
    },
    native: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl-stb-natives-macos-arm64.jar',
    },
  },
  'lwjgl-tinyfd': {
    newVersion: '3.3.0',
    artifact: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl-tinyfd.jar',
    },
    native: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl-tinyfd-natives-macos-arm64.jar',
    },
  },
  'lwjgl-glfw': {
    newVersion: '3.3.0',
    artifact: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl-glfw.jar',
    },
    native: {
      url: 'https://f001.backblazeb2.com/file/minecraft-jar-command/patch/lwjgl/lwjgl-release-3.3.0/lwjgl-glfw-natives-macos-arm64.jar',
    },
  },
}

interface VersionManifest {
  latest: {
    release: string
    snapshot: string
  }

  versions: VersionManifestVersion[]
}

interface VersionManifestVersion {
  id: string
  type: 'release' | 'snapshot'
  url: string
  time: string
  releaseTime: string
}

type Version = {
  libraries: Library[]
  patched?: boolean
}

interface Library {
  name: string
  rules?: Rule[]

  natives?: Record<string, string>
  downloads: {
    artifact: Asset
    classifiers?: Record<string, Asset>
  }
}

interface Rule {
  action: 'allow' | 'disallow'
  os?: {
    name: string
  }
}

interface Asset {
  path: string
  sha1: string
  size: number
  url: string
}

export const patchM1Version = async (version: string, dir: string) => {
  if (process.platform !== 'darwin') return
  if (process.arch !== 'arm64') return

  await mkdirp(dir)
  const filePath = joinPath(dir, `${version}.json`)

  const checkShouldPatch: () => Promise<boolean> = async () => {
    const versionExists = await exists(filePath)
    if (!versionExists) return true

    try {
      const data = await readFile(filePath, 'utf-8')
      const json = JSON.parse(data) as Version

      return !json.patched
    } catch {
      return true
    }
  }

  const shouldPatch = await checkShouldPatch()
  if (!shouldPatch) return

  const resp = await axios.get<VersionManifest>(
    'https://launchermeta.mojang.com/mc/game/version_manifest_v2.json'
  )

  const versionURL = resp.data.versions.find(v => v.id === version)?.url
  if (!versionURL) {
    throw new Error(`Unknown Minecraft version: ${version}`)
  }

  const { data: versionManifest } = await axios.get<Version>(versionURL)

  /* eslint-disable no-await-in-loop */
  for (const lib of versionManifest.libraries) {
    const skip =
      lib.rules?.some(r => r.action === 'disallow' && r.os?.name === 'osx') ??
      false

    if (skip) continue

    const [org, name, version] = lib.name.split(':')
    const versionRX = new RegExp(version, 'g')

    const patch: LibraryPatch | undefined = patches[name]
    if (!patch) continue

    lib.name = `${org}:${name}:${patch.newVersion}`

    await replaceAsset(lib.downloads.artifact, patch.artifact)
    lib.downloads.artifact.path = lib.downloads.artifact.path.replace(
      versionRX,
      patch.newVersion
    )

    const osxKey: string | undefined = lib.natives?.osx
    if (!osxKey) continue

    const osxClassifier: Asset | undefined = lib.downloads.classifiers?.[osxKey]
    if (!osxClassifier) continue

    await replaceAsset(osxClassifier, patch.native)
    osxClassifier.path = osxClassifier.path.replace(versionRX, patch.newVersion)
  }
  /* eslint-enable no-await-in-loop */

  versionManifest.patched = true
  const json = JSON.stringify(versionManifest, null, 2)
  await writeFile(filePath, json)
}

const replaceAsset = async (asset: Asset, patch: AssetPatch) => {
  if (patch.sha1 === undefined || patch.size === undefined) {
    const { data } = await axios.get<Buffer>(patch.url)

    const hash = createHash('sha1')
    hash.update(data)

    patch.sha1 = hash.digest('hex')
    patch.size = data.length
  }

  asset.url = patch.url
  asset.sha1 = patch.sha1
  asset.size = patch.size
}
