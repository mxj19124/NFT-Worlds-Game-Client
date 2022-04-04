import { getGlobal } from '@electron/remote'

const env = getGlobal('env') as IPC.Environment

export const IS_DEV = env.isDev
export const APP_ROOT = env.appRoot
export const APP_ROOT_ABSOLUTE = env.appRootAbsolute
export const MAM_MEMORY_GB = env.maxMemoryGB
