import React, { type FC, useEffect } from 'react'
import styled from 'styled-components'
import { useStore } from '../hooks/useStore'
import { authGetWallets } from '../ipc/nftw'
import { PlayerProfile } from './PlayerProfile'

const SettingsContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 30px;
`

export const LayoutProfile: FC = () => {
  const { state, dispatch } = useStore()

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!state.user) return
      if (!state.wallets) return

      console.log('updating wallet info')
      // @ts-expect-error Untyped Property
      const mcToken = state.user._msmc.mcToken as string
      const wallets = await authGetWallets(mcToken, state.wallets?.nftwToken)

      dispatch({ type: 'setWallets', value: wallets })
    }, 30 * 1000)

    return () => clearInterval(interval)
  }, [state.user, state.wallets, dispatch])

  return (
    <SettingsContainer>
      {state.user && state.wallets && (
        <PlayerProfile
          profile={state.user}
          balance={state.wallets.wrldBalance}
        />
      )}
    </SettingsContainer>
  )
}
