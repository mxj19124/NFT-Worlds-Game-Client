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

  return state.user ? <Launch /> : <Login />
}
