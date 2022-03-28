import { type Dispatch } from 'react'
import { refresh, validate } from '../ipc/auth'
import { type Action, type State } from './reducer'

export const init = async (state: State, dispatch: Dispatch<Action>) => {
  if (state.user) {
    const isValid = await validate(state.user)
    if (!isValid) {
      dispatch({ type: 'setStatus', value: 'authenticating' })
      try {
        const profile = await refresh(state.user)
        dispatch({ type: 'setUser', value: profile })
      } catch {
        dispatch({ type: 'clearUser' })
      }
    }
  }

  dispatch({ type: 'setStatus', value: 'idle' })
}
