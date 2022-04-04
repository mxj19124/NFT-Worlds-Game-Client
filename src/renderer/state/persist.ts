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

  maxMemoryGB: State['maxMemoryGB']
  minMemoryGB: State['minMemoryGB']
}

export const initState: (initialState: State) => State = initialState => {
  return {
    ...initialState,
    user: store.get('user') ?? initialState.user,

    launchWidth: store.get('settings')?.width ?? initialState.launchWidth,
    launchHeight: store.get('settings')?.height ?? initialState.launchHeight,
    launchFullscreen:
      store.get('settings')?.fullscreen ?? initialState.launchFullscreen,

    maxMemoryGB: store.get('settings')?.maxMemoryGB ?? initialState.maxMemoryGB,
    minMemoryGB: store.get('settings')?.minMemoryGB ?? initialState.minMemoryGB,
  }
}

export const persist = (state: State) => {
  if (state.user) store.set('user', state.user)
  else store.delete('user')

  const settings: PersistentSettings = {
    width: state.launchWidth,
    height: state.launchHeight,
    fullscreen: state.launchFullscreen,

    maxMemoryGB: state.maxMemoryGB,
    minMemoryGB: state.minMemoryGB,
  }

  store.set('settings', settings)
}
