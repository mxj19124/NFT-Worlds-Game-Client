declare namespace IPC {
  type Profile = import('msmc').profile
  type LauncherOptions = import('minecraft-launcher-core').ILauncherOptions

  export interface WalletInfo extends NFTWorlds.PlayerWallets {
    nftwToken: string
  }

  export interface AuthResult {
    token: string
    profile: Profile
    wallets: WalletInfo
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
    version: string
    appRoot: string
    appRootAbsolute: string
    maxMemoryGB: number
  }
}
