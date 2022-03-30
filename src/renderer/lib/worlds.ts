import axios from 'axios'

type World = NFTWorlds.World
export const fetchWorlds: () => Promise<World[] | Error> = async () => {
  try {
    const { data: worlds } = await axios.get<World[]>(
      'https://status-api.nftworlds.com/latest'
    )

    for (const world of worlds) {
      world.description = world.description.replace(/\\n/g, '\n').trim()
    }

    return worlds
  } catch (error: unknown) {
    if (error instanceof Error) return error
    throw error
  }
}
