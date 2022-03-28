import { getGlobal } from '@electron/remote'

const env = getGlobal('env') as IPC.Environment

export const IS_DEV = env.isDev
export const APP_ROOT = env.appRoot
