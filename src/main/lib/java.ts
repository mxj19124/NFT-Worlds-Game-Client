import axios from 'axios'
import { type Buffer } from 'buffer'
import { BrowserWindow, dialog, type WebContents } from 'electron'
import execa from 'execa'
import extract from 'extract-zip'
import { unlink, writeFile } from 'fs/promises'
import mkdirp from 'mkdirp'
import { join as joinPath, parse } from 'path'
import process from 'process'
import { APP_ROOT, APP_ROOT_ABSOLUTE } from './env'

const checkGlobalJava: () => Promise<boolean> = async () => {
  try {
    await execa('java', ['-version'])
    await execa('javaw', ['-version'])

    return true
  } catch {
    return false
  }
}

const checkLocalJava: (path: string) => Promise<boolean> = async path => {
  try {
    const binPath = joinPath(path, 'bin')

    await execa('java', ['-version'], { cwd: binPath })
    await execa('javaw', ['-version'], { cwd: binPath })

    return true
  } catch {
    return false
  }
}

type Platform = 'windows' | 'linux' | 'mac'
type Arch = 'x64' | 'aarch64'

const javaDownloadURL = (jdkVersion: string) => {
  const encodedJDKVersion = encodeURI(jdkVersion)
  const JRE_VERSION = jdkVersion.replace('+', '_')

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

  const arch: Arch | undefined =
    process.arch === 'x64'
      ? 'x64'
      : process.arch === 'arm64'
      ? 'aarch64'
      : undefined

  if (!arch) {
    throw new Error(`Unsupported architecture: '${process.arch}'`)
  }

  // JDK builds do not exist for ARM-based Windows
  if (platform === 'windows' && arch === 'aarch64') {
    throw new Error(`Unsupported architecture: '${process.arch}'`)
  }

  const ext = platform === 'windows' ? 'zip' : 'tar.gz'
  const url = `https://github.com/adoptium/temurin17-binaries/releases/download/jdk-${encodedJDKVersion}/OpenJDK17U-jre_${arch}_${platform}_hotspot_${JRE_VERSION}.${ext}`

  return { url, platform, arch }
}

interface GlobalJava {
  type: 'global'
}

interface LocalJava {
  type: 'local'
  root: string
  javaw: string
}

type JavaInstall = GlobalJava | LocalJava
export const ensureJava: (
  webContents: WebContents
) => Promise<JavaInstall | undefined> = async webContents => {
  const JDK_VERSION = '17.0.2+8'
  const win = BrowserWindow.fromWebContents(webContents)!

  const hasGlobal = await checkGlobalJava()
  if (hasGlobal) {
    return { type: 'global' }
  }

  // Ensure download directory exists
  await mkdirp(APP_ROOT)
  const javaRoot = joinPath(APP_ROOT, `jdk-${JDK_VERSION}-jre`)

  const hasLocal = await checkLocalJava(javaRoot)
  if (hasLocal) {
    return {
      type: 'local',
      root: javaRoot,
      javaw: joinPath(javaRoot, 'bin', 'javaw'),
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

  const { url, platform } = javaDownloadURL(JDK_VERSION)
  const resp = await axios.get<Buffer>(url, { responseType: 'arraybuffer' })

  const { base: filename } = parse(url)
  const archivePath = joinPath(APP_ROOT, filename)
  await writeFile(archivePath, resp.data)

  if (platform === 'windows') {
    await extract(archivePath, { dir: APP_ROOT_ABSOLUTE })
  } else {
    // TODO: Untar
  }

  await unlink(archivePath)
  const hasDownloadedLocal = await checkLocalJava(javaRoot)
  if (hasDownloadedLocal) {
    return {
      type: 'local',
      root: javaRoot,
      javaw: joinPath(javaRoot, 'bin', 'javaw'),
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
