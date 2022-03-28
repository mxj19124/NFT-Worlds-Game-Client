import { type Reducer } from 'react'

export interface State {
  // TODO
}

export type Action = { type: string; value: unknown }

export const reducer: Reducer<State, Action> = (previousState, action) => {
  switch (action.type) {
    default:
      throw new Error('Invalid Action')
  }
}

export const initialState: State = {
  // TODO
}
