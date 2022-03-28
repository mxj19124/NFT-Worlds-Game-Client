import React, { type FC, useCallback } from 'react'
import { useStore } from '../hooks/useStore'
import { type World } from '../lib/worlds'

export const Launch: FC<{ children?: never }> = () => {
  const { state } = useStore()
  if (!state.user) throw new Error('Launch view rendered with no user')
  if (!state.worlds) throw new Error('Launch view rendered with no worlds')
  if (state.worlds instanceof Error) {
    throw new TypeError('Launch view rendered with worlds error')
  }

  const launchWorld = useCallback((world: World) => {
    console.log(world)
  }, [])

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
