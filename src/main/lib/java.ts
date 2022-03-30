import axios from 'axios'
import { type Buffer } from 'buffer'
import { BrowserWindow, dialog, type WebContents } from 'electron'
import execa from 'execa'
import extract from 'extract-zip'
import { createReadStream } from 'fs'
import { unlink, writeFile } from 'fs/promises'
import mkdirp from 'mkdirp'
import { join as joinPath, parse } from 'path'
import process from 'process'
import { parse as parseVersion } from 'semver'
import tar from 'tar-fs'
import { createGunzip } from 'zlib'
import { APP_ROOT, APP_ROOT_ABSOLUTE } from './env'

type Platform = 'windows' | 'linux' | 'mac'
const resolvePlatform: () => Platform = () => {
  const platform: Platform | undefined =
    process.platform === 'win32'
      ? 'windows'
      : process.platform === 'linux'
      ? 'linux'
      : process.platform === 'darwin'
      ? 'mac'
      : undefined

  if (!platform) {
    throw new Error(`Unsupported platform: '${process.platform}'`)
  }

  return platform
}

type Arch = 'x64' | 'aarch64'
const resolveArch: () => Arch = () => {
  const arch: Arch | undefined =
    process.arch === 'x64'
      ? 'x64'
      : process.arch === 'arm64'
      ? 'aarch64'
      : undefined

  if (!arch) {
    throw new Error(`Unsupported architecture: '${process.arch}'`)
  }

  return arch
}

const resolveJavaPath = (
  root: string,
  platform: Platform,
  forceJava?: boolean
) => {
  switch (platform) {
    case 'windows': {
      const exe = forceJava ? 'java.exe' : 'javaw.exe'
      return joinPath(root, 'bin', exe)
    }

    case 'mac':
      return joinPath(root, 'Contents', 'Home', 'bin', 'java')

    case 'linux':
      return joinPath(root, 'bin', 'java')

    default:
      throw new Error('Unknown platform')
  }
}

const parseJavaVersion: (stdout: string) => number | undefined = stdout => {
  if (stdout === '') return undefined
  const lines = stdout.split('\n')

  const first = lines[0]
  if (!first) return undefined

  const split = first.split(' ')
  if (!split) return undefined

  const quoted = split[2]
  if (!quoted) return undefined

  const raw = quoted.replace(/['"]+/g, '')
  const version = parseVersion(raw)
  if (!version) return undefined

  return version.major
}

const checkGlobalJava: (
  platform: Platform
) => Promise<number | undefined> = async platform => {
  const javaPath = resolveJavaPath('', platform, true)
  const { base: executable } = parse(javaPath)

  try {
    const { stderr } = await execa(executable, ['-version'])
    return parseJavaVersion(stderr)
  } catch {
    return undefined
  }
}

const checkLocalJava: (
  platform: Platform,
  path: string
) => Promise<number | undefined> = async (platform, path) => {
  try {
    const javaPath = resolveJavaPath(path, platform, true)
    const { stderr } = await execa(javaPath, ['-version'])

    return parseJavaVersion(stderr)
  } catch {
    return undefined
  }
}

const javaDownloadURL = (jdkVersion: string) => {
  const encodedJDKVersion = encodeURI(jdkVersion)
  const JRE_VERSION = jdkVersion.replace('+', '_')

  const platform = resolvePlatform()
  const arch = resolveArch()

  // JDK builds do not exist for ARM-based Windows
  if (platform === 'windows' && arch === 'aarch64') {
    throw new Error(`Unsupported architecture: '${process.arch}'`)
  }

  const ext = platform === 'windows' ? 'zip' : 'tar.gz'
  const url = `https://github.com/adoptium/temurin17-binaries/releases/download/jdk-${encodedJDKVersion}/OpenJDK17U-jre_${arch}_${platform}_hotspot_${JRE_VERSION}.${ext}`

  return url
}

interface GlobalJava {
  type: 'global'
  version: number
}

interface LocalJava {
  type: 'local'
  version: number
  root: string
  javaPath: string
}

type JavaInstall = GlobalJava | LocalJava
export const ensureJava: (
  webContents: WebContents,
  launchSteps: number
) => Promise<JavaInstall | undefined> = async (webContents, launchSteps) => {
  const JDK_VERSION = '17.0.2+8'
  const win = BrowserWindow.fromWebContents(webContents)!

  const platform = resolvePlatform()
  const globalVersion = await checkGlobalJava(platform)
  if (globalVersion) {
    return { type: 'global', version: globalVersion }
  }

  // Ensure download directory exists
  await mkdirp(APP_ROOT)
  const javaRoot = joinPath(APP_ROOT, `jdk-${JDK_VERSION}-jre`)

  const javaPath = resolveJavaPath(javaRoot, platform)
  const localVersion = await checkLocalJava(platform, javaRoot)
  if (localVersion) {
    return {
      type: 'local',
      version: localVersion,
      root: javaRoot,
      javaPath,
    }
  }

  const { response } = await dialog.showMessageBox(win, {
    type: 'warning',
    title: win.title,
    message:
      'No Java installation was detected!\n' +
      'Would you like to automatically download Java?',
    buttons: ['Yes', 'No'],
  })

  // User selected 'No'
  if (response === 1) return undefined

  webContents.send('launch:@update', 'Downloading Java', 1 / launchSteps)
  const url = javaDownloadURL(JDK_VERSION)
  const resp = await axios.get<Buffer>(url, { responseType: 'arraybuffer' })

  const { base: filename } = parse(url)
  const archivePath = joinPath(APP_ROOT, filename)
  await writeFile(archivePath, resp.data)

  webContents.send('launch:@update', 'Extracting Java', 2 / launchSteps)
  if (platform === 'windows') {
    await extract(archivePath, { dir: APP_ROOT_ABSOLUTE })
  } else {
    const stream = createReadStream(archivePath)
      .pipe(createGunzip())
      .pipe(tar.extract(APP_ROOT_ABSOLUTE))

    const end = new Promise<void>((resolve, reject) => {
      stream.on('finish', () => resolve())
      stream.on('error', error => reject(error))
    })

    await end
  }

  await unlink(archivePath)
  const downloadedVersion = await checkLocalJava(platform, javaRoot)
  if (downloadedVersion) {
    return {
      type: 'local',
      version: downloadedVersion,
      root: javaRoot,
      javaPath,
    }
  }

  await dialog.showMessageBox(win, {
    type: 'error',
    title: win.title,
    message:
      'Java installation failed!\n' +
      'Install Java manually to resolve this error.',
  })

  return undefined
}
