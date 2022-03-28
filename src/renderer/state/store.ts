import { createContext, type Dispatch } from 'react'
import { type Action, initialState, type State } from './reducer'

interface Context {
  state: State
  dispatch: Dispatch<Action>
}

// @ts-expect-error Uninitialized Store
export const store = createContext<Context>({ state: initialState })
