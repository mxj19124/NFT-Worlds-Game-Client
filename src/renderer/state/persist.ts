import Store from 'electron-store'
import { type State } from './reducer'

const store = new Store<PersistentStore>()
interface PersistentStore {
  user: State['user']
}

export const initState: (initialState: State) => State = initialState => {
  return {
    ...initialState,
    user: store.get('user') ?? initialState.user,
  }
}

export const persist = (state: State) => {
  if (state.user) store.set('user', state.user)
  else store.delete('user')
}
