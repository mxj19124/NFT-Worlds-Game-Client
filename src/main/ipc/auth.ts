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

  const nftWorldToken = await authorize(token)
  const wallets = await getWallets(nftWorldToken)

  const authResult: IPC.AuthResult = {
    token,
    profile,
    wallets,
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

  const nftWorldToken = await authorize(token)
  const wallets = await getWallets(nftWorldToken)

  const authResult: IPC.AuthResult = {
    token,
    profile: newProfile,
    wallets,
  }

  return authResult
}
