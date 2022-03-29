import axios from 'axios'

type World = NFTWorlds.World
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
