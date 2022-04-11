import { type AxiosError } from 'axios'
import { authorize, getWallets } from '../lib/playerAPI'

// @ts-expect-error Type Predicate
const isAxiosError: (error: unknown) => error is AxiosError = error => {
  if (!(error instanceof Error)) return false
  if (!('isAxiosError' in error)) return false

  // @ts-expect-error Type Check
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return error.isAxiosError
}

export const authGetWallets: (
  mcToken: string,
  nftwToken?: string
) => Promise<IPC.WalletInfo> = async (mcToken, nftwToken) => {
  if (!nftwToken) {
    const token = await authorize(mcToken)
    const wallets = await getWallets(token)

    return { ...wallets, nftwToken: token }
  }

  try {
    const wallets = await getWallets(nftwToken)
    return { ...wallets, nftwToken }
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 401) {
      const token = await authorize(mcToken)
      const wallets = await getWallets(token)

      return { ...wallets, nftwToken: token }
    }

    throw error
  }
}
