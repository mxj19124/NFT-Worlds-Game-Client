import Axios from 'axios'

const axios = Axios.create({
  baseURL: 'https://players-api.nftworlds.com',
})

export const authorize = async (token: string) => {
  const resp = await axios.post<NFTWorlds.PlayerAuth>('/authorizations', {
    providedAccessToken: token,
  })

  return resp.data.accessToken
}

export const getWallets = async (token: string) => {
  const resp = await axios.get<NFTWorlds.PlayerWallets>('/wallets', {
    headers: {
      Authorization: token,
    },
  })

  return resp.data
}
