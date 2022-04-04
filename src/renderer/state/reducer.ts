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

  maxMemoryGB: number
  minMemoryGB: number
}

export type Action =
  | { type: 'setStatus'; value: Status }
  | { type: 'setUser'; value: Profile }
  | { type: 'clearUser' }
  | { type: 'setWorlds'; value: NFTWorlds.World[] | Error }
  | { type: 'clearWorlds' }
  | { type: 'toggleSettings' }
  | { type: 'setWidth'; value: number }
  | { type: 'setHeight'; value: number }
  | { type: 'setFullscreen'; value: boolean }
  | { type: 'toggleFullscreen' }
  | { type: 'setMaxMemory'; value: number }
  | { type: 'setMinMemory'; value: number }

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

    case 'setWidth':
      return { ...previousState, launchWidth: action.value }

    case 'setHeight':
      return { ...previousState, launchHeight: action.value }

    case 'setFullscreen':
      return { ...previousState, launchFullscreen: action.value }

    case 'toggleFullscreen':
      return {
        ...previousState,
        launchFullscreen: !previousState.launchFullscreen,
      }

    case 'setMaxMemory':
      return { ...previousState, maxMemoryGB: action.value }

    case 'setMinMemory':
      return { ...previousState, minMemoryGB: action.value }

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

  maxMemoryGB: 2,
  minMemoryGB: 1,
}
