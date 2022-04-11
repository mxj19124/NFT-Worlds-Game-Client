import { type WebContents } from 'electron'
import msmc, { type profile as Profile } from 'msmc'
import { authorize, getWallets } from '../lib/playerAPI'

export const login: (
  webContents: WebContents
) => Promise<IPC.AuthResult> = async webContents => {
  const result = await msmc.fastLaunch('electron', update => {
    webContents.send('auth:@update', update)
  })

  if (msmc.errorCheck(result)) {
    throw new Error(result.reason)
  }

  const token = result.access_token!
  const profile = result.profile!

  webContents.send('auth:@update', {
    data: 'Authenticating with NFT Worlds',
    percent: 100,
  })

  const timeout = setTimeout(() => {
    webContents.send('auth:@update', {
      data: 'Your NFT Worlds account is being set up. Please wait...',
      percent: 100,
    })
  }, 5000)

  const nftwToken = await authorize(token)
  const wallets = await getWallets(nftwToken)

  clearTimeout(timeout)
  const authResult: IPC.AuthResult = {
    token,
    profile,
    wallets: {
      ...wallets,
      nftwToken,
    },
  }

  return authResult
}

export const validate = (profile: Profile) => {
  const isValid = msmc.validate(profile)
  return isValid
}

export const refresh: (
  profile: Profile,
  webContents: WebContents
) => Promise<IPC.AuthResult> = async (profile, webContents) => {
  const result = await msmc.refresh(profile, update => {
    webContents.send('auth:@update', update)
  })

  if (msmc.errorCheck(result)) {
    throw new Error(result.reason)
  }

  const token = result.access_token!
  const newProfile = result.profile!

  const nftwToken = await authorize(token)
  const wallets = await getWallets(nftwToken)

  const authResult: IPC.AuthResult = {
    token,
    profile: newProfile,
    wallets: {
      ...wallets,
      nftwToken,
    },
  }

  return authResult
}
