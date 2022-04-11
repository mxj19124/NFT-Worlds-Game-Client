import { safeStorage } from 'electron'
import isDev from 'electron-is-dev'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { nanoid } from 'nanoid'
import { join } from 'path'
import { APP_ROOT } from './env'

const ENCRYPT_IN_DEV = false
const KEY_LENGTH = 30
const KEY_FILENAME = 'store.json.key'

const generateKey = () => nanoid(KEY_LENGTH)

export const getSecureKey: () => string | undefined = () => {
  if (isDev && !ENCRYPT_IN_DEV) return undefined

  const canEncrypt = safeStorage.isEncryptionAvailable()
  if (!canEncrypt) return undefined

  const keyFile = join(APP_ROOT, KEY_FILENAME)
  const keyFileExists = existsSync(keyFile)
  if (!keyFileExists) {
    const key = generateKey()

    const encrypted = safeStorage.encryptString(key)
    writeFileSync(keyFile, encrypted)

    return key
  }

  const encrypted = readFileSync(keyFile)
  const key = safeStorage.decryptString(encrypted)

  return key
}
