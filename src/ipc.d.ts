declare namespace IPC {
  type LauncherOptions = import('minecraft-launcher-core').ILauncherOptions

  export interface LaunchOptions {
    width?: number
    height?: number
    fullscreen?: boolean

    memory: LauncherOptions['memory']

    enableShaders: boolean
  }

  export interface Environment {
    isDev: boolean
    appRoot: string
    appRootAbsolute: string
    maxMemoryGB: number
  }
}
