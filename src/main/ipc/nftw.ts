import { authorize, getWallets } from '../lib/playerAPI'

export const authGetWallets = async (token: string) => {
  const nftwToken = await authorize(token)
  const wallets = await getWallets(nftwToken)

  return wallets
}
