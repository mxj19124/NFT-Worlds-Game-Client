import { type profile as Profile } from 'msmc'
import { type Reducer } from 'react'

export interface State {
  user: Profile | undefined
}

export type Action = { type: 'setUser'; value: Profile } | { type: 'clearUser' }

export const reducer: Reducer<State, Action> = (previousState, action) => {
  switch (action.type) {
    case 'setUser': {
      return { ...previousState, user: action.value }
    }

    case 'clearUser':
      return { ...previousState, user: undefined }

    default:
      throw new Error('Invalid Action')
  }
}

export const initialState: State = {
  user: undefined,
}
