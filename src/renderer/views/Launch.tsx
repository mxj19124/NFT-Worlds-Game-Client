import React, { type FC } from 'react'
import { useStore } from '../hooks/useStore'

export const Launch: FC<{ children?: never }> = () => {
  const { state } = useStore()
  if (!state.user) throw new Error('Launch view rendered with no user')

  return (
    <div>
      <h1>Logged in as {state.user.name}</h1>
    </div>
  )
}
