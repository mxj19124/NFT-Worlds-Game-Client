import axios from 'axios'

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

interface Branding {
  icon: string
  banner: string
}

interface Connection {
  address: string
  port: string | number
  consolePort: number
}

export const fetchWorlds: () => Promise<World[] | Error> = async () => {
  try {
    const resp = await axios.get<World[]>(
      'https://status-api.nftworlds.com/latest'
    )

    return resp.data
  } catch (error: unknown) {
    if (error instanceof Error) return error
    throw error
  }
}
