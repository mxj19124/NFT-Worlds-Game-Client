import React, { type FC } from 'react'
import styled from 'styled-components'
import { World } from './World'

const Container = styled.div`
  --padding: 20px;

  margin-top: var(--padding);
  padding: var(--padding);
  padding-top: 0;
  max-height: calc(100% - var(--padding) * 2);
  overflow-y: scroll;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`

interface Props {
  worlds: NFTWorlds.World[]
  disabled: boolean

  launchWorld: (world: NFTWorlds.World) => void
}

export const Worlds: FC<Props> = ({ worlds, disabled, launchWorld }) => (
  <Container>
    {worlds.map(world => (
      <World
        key={world.worldId}
        world={world}
        offline={!world.javaOnline}
        disabled={disabled}
        onLaunch={launchWorld}
      />
    ))}
  </Container>
)
