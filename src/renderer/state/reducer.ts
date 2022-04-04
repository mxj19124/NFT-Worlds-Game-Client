import { type profile as Profile } from 'msmc'
import { type Reducer } from 'react'

type Status =
  | 'init'
  | 'idle'
  | 'authenticating'
  | 'gameLaunching'
  | 'gameRunning'

export interface State {
  status: Status
  showSettings: boolean

  user: Profile | undefined
  worlds: NFTWorlds.World[] | Error | undefined

  launchWidth: NonNullable<IPC.LaunchOptions['width']>
  launchHeight: NonNullable<IPC.LaunchOptions['height']>
  launchFullscreen: NonNullable<IPC.LaunchOptions['fullscreen']>

  maxMemory: IPC.LaunchOptions['memory']['max']
  minMemory: IPC.LaunchOptions['memory']['min']
}

export type Action =
  | { type: 'setStatus'; value: Status }
  | { type: 'setUser'; value: Profile }
  | { type: 'clearUser' }
  | { type: 'setWorlds'; value: NFTWorlds.World[] | Error }
  | { type: 'clearWorlds' }
  | { type: 'toggleSettings' }

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

    case 'setWorlds': {
      return { ...previousState, worlds: action.value }
    }

    case 'clearWorlds':
      return { ...previousState, worlds: undefined }

    case 'toggleSettings':
      return { ...previousState, showSettings: !previousState.showSettings }

    default:
      throw new Error('Invalid Action')
  }
}

export const initialState: State = {
  status: 'init',
  showSettings: false,

  user: undefined,
  worlds: undefined,

  launchWidth: 1280,
  launchHeight: 720,
  launchFullscreen: false,

  maxMemory: '2G',
  minMemory: '1G',
}
