import nbt from 'nbt'

export interface Server {
  name: string
  ip: string
}

export const worldToServer: (world: NFTWorlds.World) => Server = ({
  name,
  connection,
}) => ({ name, ip: `${connection.address}:${connection.port}` })

export const generateServersFile = (servers: Server[]) => {
  const serverNbt = servers.map(({ name, ip }) => ({
    name: { type: 'string', value: name },
    ip: { type: 'string', value: ip },
  }))

  const serversDat = nbt.writeUncompressed({
    name: '',
    value: {
      servers: {
        type: 'list',
        value: {
          type: 'compound',
          value: serverNbt,
        },
      },
    },
  })

  return serversDat
}
