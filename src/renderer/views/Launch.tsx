import React, { type FC, useCallback, useEffect, useMemo } from 'react'
import { Worlds } from '../components/Worlds'
import { useStore } from '../hooks/useStore'
import { launch, launchEvents } from '../ipc/launch'

export const Launch: FC<{ children?: never }> = () => {
  const { state, dispatch } = useStore()
  if (!state.user) throw new Error('Launch view rendered with no user')
  if (!state.worlds) throw new Error('Launch view rendered with no worlds')
  if (state.worlds instanceof Error) {
    throw new TypeError('Launch view rendered with worlds error')
  }

  const disabled = useMemo<boolean>(
    () => state.status === 'gameRunning' || state.status === 'gameLaunching',
    [state]
  )

  const onClose = useCallback(() => {
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
    <Worlds
      worlds={state.worlds}
      disabled={disabled}
      launchWorld={launchWorld}
    />
  )
}
