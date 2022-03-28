import React, { type FC, useCallback } from 'react'
import { useStore } from '../hooks/useStore'
import { login } from '../ipc/auth'

export const LoginMicrosoftButton: FC<{ children?: never }> = () => {
  const { dispatch } = useStore()
  const handleLogin = useCallback(() => {
    dispatch({ type: 'setStatus', value: 'authenticating' })

    void login()
      .then(profile => {
        dispatch({ type: 'setUser', value: profile })
      })
      .catch(console.error)
      .finally(() => {
        dispatch({ type: 'setStatus', value: 'idle' })
      })
  }, [dispatch])

  return (
    <button type='button' onClick={handleLogin}>
      Login with Microsoft Account
    </button>
  )
}
