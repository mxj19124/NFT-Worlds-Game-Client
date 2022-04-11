import Store from 'electron-store'
import { APP_ROOT_ABSOLUTE, STORE_KEY } from '../lib/env'
import { type State } from './reducer'

const store = new Store<PersistentStore>({
  name: 'store',
  cwd: APP_ROOT_ABSOLUTE,
  fileExtension: (STORE_KEY && 'json.enc') || 'json',
  encryptionKey: STORE_KEY,
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

  shaders: State['launchShaders']
}

export const initState: (initialState: State) => State = initialState => {
  const settings = store.get('settings')

  return {
    ...initialState,
    user: store.get('user') ?? initialState.user,

    launchWidth: settings?.width ?? initialState.launchWidth,
    launchHeight: settings?.height ?? initialState.launchHeight,
    launchFullscreen: settings?.fullscreen ?? initialState.launchFullscreen,

    maxMemoryGB: settings?.maxMemoryGB ?? initialState.maxMemoryGB,
    minMemoryGB: settings?.minMemoryGB ?? initialState.minMemoryGB,

    launchShaders: settings?.shaders ?? initialState.launchShaders,
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

    shaders: state.launchShaders,
  }

  store.set('settings', settings)
}
