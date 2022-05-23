import { getGlobal } from '@electron/remote'

const env = getGlobal('env') as IPC.Environment

export const IS_DEV = env.isDev
export const VERSION = env.version
export const APP_ROOT = env.appRoot
export const APP_ROOT_ABSOLUTE = env.appRootAbsolute
export const MAX_MEMORY_GB = env.maxMemoryGB
export const STORE_KEY = getGlobal('__SECURE_STORE_KEY') as string | undefined
