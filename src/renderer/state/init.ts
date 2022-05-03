import process from 'process'
import { type Dispatch } from 'react'
import { refresh, validate } from '../ipc/auth'
import { authGetWallets } from '../ipc/nftw'
import { fetchWorlds } from '../lib/worlds'
import { type Action, type State } from './reducer'

export const init = async (state: State, dispatch: Dispatch<Action>) => {
  const worlds = await fetchWorlds()
  dispatch({ type: 'setWorlds', value: worlds })

  // Disable shaders by default on macOS
  if (process.platform === 'darwin') {
    dispatch({
      type: 'setDisableShaders',
      value: 'Shaders are unsupported on macOS due to compatibility issues.',
    })
  }

  if (state.user) {
    const isValid = await validate(state.user)
    if (isValid) {
      // @ts-expect-error Untyped Property
      const token = state.user._msmc.mcToken as string
      const wallets = await authGetWallets(token, state.wallets?.nftwToken)

      dispatch({ type: 'setWallets', value: wallets })
    } else {
      dispatch({ type: 'setStatus', value: 'authenticating' })
      try {
        const { profile, wallets } = await refresh(state.user)

        dispatch({ type: 'setUser', value: profile })
        dispatch({ type: 'setWallets', value: wallets })
      } catch {
        dispatch({ type: 'clearUser' })
      }
    }
  }

  dispatch({ type: 'setStatus', value: 'idle' })
}
