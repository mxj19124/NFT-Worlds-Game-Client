import React, { type FC, useCallback } from 'react'
import { useStore } from '../hooks/useStore'
import { launch } from '../ipc/launch'
import { type World } from '../lib/worlds'

export const Launch: FC<{ children?: never }> = () => {
  const { state } = useStore()
  if (!state.user) throw new Error('Launch view rendered with no user')
  if (!state.worlds) throw new Error('Launch view rendered with no worlds')
  if (state.worlds instanceof Error) {
    throw new TypeError('Launch view rendered with worlds error')
  }

  const launchWorld = useCallback(
    (world: World) => {
      if (!state.user) throw new Error('Launch requested with no user')
      if (!state.worlds) throw new Error('Launch requested with no worlds')
      if (state.worlds instanceof Error) {
        throw new TypeError('Launch requested with worlds error')
      }

      const options = { version: '1.18.2', memory: { max: '6G', min: '4G' } }
      void launch(state.user, options, world, state.worlds)
    },
    [state]
  )

  return (
    <div>
      <h1>Logged in as {state.user.name}</h1>

      {state.worlds.map(world => (
        <button
          key={world.worldId}
          type='button'
          onClick={() => launchWorld(world)}
        >
          Launch {world.name}
        </button>
      ))}
    </div>
  )
}
