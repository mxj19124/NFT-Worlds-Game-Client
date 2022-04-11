declare namespace IPC {
  type Profile = import('msmc').profile
  type LauncherOptions = import('minecraft-launcher-core').ILauncherOptions

  export interface AuthResult {
    token: string
    profile: Profile
    wallets: NFTWorlds.PlayerWallets
  }

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
