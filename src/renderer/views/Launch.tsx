import React, { type FC, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { World } from '../components/World'
import { useStore } from '../hooks/useStore'
import { launch, launchEvents } from '../ipc/launch'

const Worlds = styled.div`
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

export const Launch: FC<{ children?: never }> = () => {
  const { state, dispatch } = useStore()
  if (!state.user) throw new Error('Launch view rendered with no user')
  if (!state.worlds) throw new Error('Launch view rendered with no worlds')
  if (state.worlds instanceof Error) {
    throw new TypeError('Launch view rendered with worlds error')
  }

  const onClose = useCallback(() => {
    console.log('close')
    dispatch({ type: 'setStatus', value: 'idle' })
  }, [dispatch])

  useEffect(() => {
    launchEvents.addListener('close', onClose)

    return () => {
      launchEvents.removeListener('close', onClose)
    }
  }, [onClose])

  const launchWorld = useCallback(
    (world: NFTWorlds.World) => {
      if (!state.user) throw new Error('Launch requested with no user')
      if (!state.worlds) throw new Error('Launch requested with no worlds')
      if (state.worlds instanceof Error) {
        throw new TypeError('Launch requested with worlds error')
      }

      const options: IPC.LaunchOptions = {
        width: 1280,
        height: 720,
        memory: { max: '6G', min: '4G' },
      }

      dispatch({ type: 'setStatus', value: 'gameRunning' })
      void launch(state.user, options, world, state.worlds)
    },
    [state, dispatch]
  )

  return (
    <Worlds>
      {state.worlds.map(world => (
        <World
          key={world.worldId}
          world={world}
          offline={!world.javaOnline}
          disabled={state.status === 'gameRunning'}
          onLaunch={launchWorld}
        />
      ))}
    </Worlds>
  )
}
