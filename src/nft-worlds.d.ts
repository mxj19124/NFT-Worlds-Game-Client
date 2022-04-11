declare namespace NFTWorlds {
  export interface World {
    worldId: number
    name: string
    description: string
    branding: Branding
    social: unknown // TODO: Proper typedef
    connection: Connection
    javaOnline: boolean
    bedrockOnline: boolean
    playersOnline: number
    maxOnline: number
    javaPlayersOnline: number
    javaPlayersMax: number
    bedrockPlayersOnline: number
    bedrockPlayersMax: number
    lastUpdated: number
  }

  export interface Branding {
    icon: string
    banner: string
  }

  export interface Connection {
    address: string
    port: string | number
    consolePort: number
  }

  export interface PlayerAuth {
    id: string
    nftwId: string
    name: string
    accountType: 'java' | 'bedrock'
    accessToken: string
    managedWalletAddress: string
  }

  export interface PlayerWallets {
    primaryWalletAddress: string
    secondaryWalletAddresses: string
    wrldBalance: number
  }
}
