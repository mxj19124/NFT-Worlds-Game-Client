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
  showUserInfo: boolean

  user: Profile | undefined
  wallets: IPC.WalletInfo | undefined
  worlds: NFTWorlds.World[] | Error | undefined

  launchWidth: NonNullable<IPC.LaunchOptions['width']>
  launchHeight: NonNullable<IPC.LaunchOptions['height']>
  launchFullscreen: NonNullable<IPC.LaunchOptions['fullscreen']>

  maxMemoryGB: number
  minMemoryGB: number

  launchShaders: boolean
  disableShaders: string | undefined
  overrideDisableShaders: boolean
}

export type Action =
  | { type: 'setStatus'; value: Status }
  | { type: 'setUser'; value: Profile }
  | { type: 'clearUser' }
  | { type: 'setWallets'; value: IPC.WalletInfo }
  | { type: 'clearWallets' }
  | { type: 'setWorlds'; value: NFTWorlds.World[] | Error }
  | { type: 'clearWorlds' }
  | { type: 'toggleSettings' }
  | { type: 'toggleUserInfo' }
  | { type: 'setWidth'; value: number }
  | { type: 'setHeight'; value: number }
  | { type: 'setFullscreen'; value: boolean }
  | { type: 'toggleFullscreen' }
  | { type: 'setMaxMemory'; value: number }
  | { type: 'setMinMemory'; value: number }
  | { type: 'setShaders'; value: boolean }
  | { type: 'setDisableShaders'; value: string | undefined }
  | { type: 'setOverrideDisableShaders'; value: boolean }

// eslint-disable-next-line complexity
export const reducer: Reducer<State, Action> = (previousState, action) => {
  switch (action.type) {
    case 'setStatus':
      return { ...previousState, status: action.value }

    case 'setUser':
      return { ...previousState, user: action.value }

    case 'clearUser':
      return { ...previousState, user: undefined }

    case 'setWallets':
      return { ...previousState, wallets: action.value }

    case 'clearWallets':
      return { ...previousState, wallets: undefined }

    case 'setWorlds':
      return { ...previousState, worlds: action.value }

    case 'clearWorlds':
      return { ...previousState, worlds: undefined }

    case 'toggleSettings': {
      const newValue = !previousState.showSettings
      if (newValue && previousState.showUserInfo) {
        return { ...previousState, showSettings: newValue, showUserInfo: false }
      }

      return { ...previousState, showSettings: newValue }
    }

    case 'toggleUserInfo': {
      const newValue = !previousState.showUserInfo
      if (newValue && previousState.showSettings) {
        return { ...previousState, showUserInfo: newValue, showSettings: false }
      }

      return { ...previousState, showUserInfo: newValue }
    }

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

    case 'setShaders':
      return { ...previousState, launchShaders: action.value }

    case 'setDisableShaders':
      return { ...previousState, disableShaders: action.value }

    case 'setOverrideDisableShaders':
      return { ...previousState, overrideDisableShaders: action.value }

    default:
      throw new Error('Invalid Action')
  }
}

export const initialState: State = {
  status: 'init',
  showSettings: false,
  showUserInfo: false,

  user: undefined,
  wallets: undefined,
  worlds: undefined,

  launchWidth: 1280,
  launchHeight: 720,
  launchFullscreen: false,

  maxMemoryGB: 2,
  minMemoryGB: 1,

  launchShaders: true,
  disableShaders: undefined,
  overrideDisableShaders: false,
}
