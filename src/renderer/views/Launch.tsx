import React, { type FC, useCallback, useEffect } from 'react'
import { useStore } from '../hooks/useStore'
import { launch, launchEvents } from '../ipc/launch'
import { type World } from '../lib/worlds'

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
    (world: World) => {
      if (!state.user) throw new Error('Launch requested with no user')
      if (!state.worlds) throw new Error('Launch requested with no worlds')
      if (state.worlds instanceof Error) {
        throw new TypeError('Launch requested with worlds error')
      }

      const options: IPC.LaunchOptions = {
        version: '1.18.2',
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
    <>
      {state.worlds.map(world => (
        <button
          key={world.worldId}
          type='button'
          disabled={state.status === 'gameRunning'}
          onClick={() => launchWorld(world)}
        >
          Launch {world.name}
        </button>
      ))}
    </>
  )
}
