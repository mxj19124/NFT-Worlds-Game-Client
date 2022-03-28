import { type WebContents } from 'electron'
import msmc, { type profile as Profile } from 'msmc'

export const login = async (webContents: WebContents) => {
  const result = await msmc.fastLaunch('electron', update => {
    webContents.send('auth:@update', update)
  })

  result.getXbox = undefined
  return result
}

export const validate = (profile: Profile) => {
  const isValid = msmc.validate(profile)
  return isValid
}

export const refresh = async (profile: Profile, webContents: WebContents) => {
  const result = await msmc.refresh(profile, update => {
    webContents.send('auth:@update', update)
  })

  result.getXbox = undefined
  return result
}
