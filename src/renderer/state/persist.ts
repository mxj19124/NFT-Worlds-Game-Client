import Store from 'electron-store'
import { type State } from './reducer'

const store = new Store<PersistentStore>()
interface PersistentStore {}

export const initState: (initialState: State) => State = initialState => {
  return {
    ...initialState,
  }
}

export const persist = (state: State) => {
  // TODO: Persist keys
}
