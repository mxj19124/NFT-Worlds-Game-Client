import Store from 'electron-store'
import { APP_ROOT_ABSOLUTE } from '../lib/env'
import { type State } from './reducer'

const store = new Store<PersistentStore>({
  name: 'state',
  cwd: APP_ROOT_ABSOLUTE,
})

interface PersistentStore {
  user: State['user']
  settings: PersistentSettings
}

interface PersistentSettings {
  width: State['launchWidth']
  height: State['launchHeight']
  fullscreen: State['launchFullscreen']

  maxMemory: State['maxMemory']
  minMemory: State['minMemory']
}

export const initState: (initialState: State) => State = initialState => {
  return {
    ...initialState,
    user: store.get('user') ?? initialState.user,

    launchWidth: store.get('settings')?.width ?? initialState.launchWidth,
    launchHeight: store.get('settings')?.height ?? initialState.launchHeight,
    launchFullscreen:
      store.get('settings')?.fullscreen ?? initialState.launchFullscreen,

    maxMemory: store.get('settings')?.maxMemory ?? initialState.maxMemory,
    minMemory: store.get('settings')?.minMemory ?? initialState.minMemory,
  }
}

export const persist = (state: State) => {
  if (state.user) store.set('user', state.user)
  else store.delete('user')

  const settings: PersistentSettings = {
    width: state.launchWidth,
    height: state.launchHeight,
    fullscreen: state.launchFullscreen,

    maxMemory: state.maxMemory,
    minMemory: state.minMemory,
  }

  store.set('settings', settings)
}
