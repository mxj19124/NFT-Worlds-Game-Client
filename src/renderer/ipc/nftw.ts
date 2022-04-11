import { ipcRenderer } from 'electron'

export const authGetWallets = async (mcToken: string, nftwToken?: string) => {
  const wallets = (await ipcRenderer.invoke(
    'nftw:authGetWallets',
    mcToken,
    nftwToken
  )) as IPC.WalletInfo

  return wallets
}
