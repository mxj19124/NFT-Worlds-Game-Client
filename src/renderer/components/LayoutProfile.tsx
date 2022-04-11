import React, { type FC } from 'react'
import styled from 'styled-components'
import { useStore } from '../hooks/useStore'
import { PlayerProfile } from './PlayerProfile'

const SettingsContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 30px;
`

export const LayoutProfile: FC = () => {
  const { state } = useStore()
  console.log(state)

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
