import { ipcRenderer } from 'electron'

export const authGetWallets = async (token: string) => {
  const wallets = (await ipcRenderer.invoke(
    'nftw:authGetWallets',
    token
  )) as NFTWorlds.PlayerWallets

  return wallets
}
