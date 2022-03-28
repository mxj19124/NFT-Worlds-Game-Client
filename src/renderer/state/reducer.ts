import { type profile as Profile } from 'msmc'
import { type Reducer } from 'react'

type Status = 'init' | 'idle' | 'authenticating' | 'gameRunning'
export interface State {
  status: Status
  user: Profile | undefined
}

export type Action =
  | { type: 'setStatus'; value: Status }
  | { type: 'setUser'; value: Profile }
  | { type: 'clearUser' }

export const reducer: Reducer<State, Action> = (previousState, action) => {
  switch (action.type) {
    case 'setStatus': {
      return { ...previousState, status: action.value }
    }

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
  status: 'init',
  user: undefined,
}
