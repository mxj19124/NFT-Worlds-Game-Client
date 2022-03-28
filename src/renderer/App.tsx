import React, { type FC, useEffect } from 'react'
import { useStore } from './hooks/useStore'
import { init } from './state/init'
import { Launch } from './views/Launch'
import { Login } from './views/Login'

export const App: FC = () => {
  // Initialise the store
  const { state, dispatch } = useStore()
  useEffect(() => {
    void init(state, dispatch)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  // TODO: Ensure each state has a valid view
  switch (state.status) {
    case 'init':
      return null

    case 'authenticating':
      return <div>Authenticating...</div>

    case 'gameRunning':
      return <div>Game Running!</div>

    case 'idle':
      if (!state.user) return <Login />
      return <Launch />

    default:
      throw new Error('Unhandled status!')
  }
}
