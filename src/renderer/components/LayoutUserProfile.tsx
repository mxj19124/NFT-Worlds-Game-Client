import React, { type FC } from 'react'
import styled from 'styled-components'
import { useStore } from '../hooks/useStore'
import { UserProfile } from './UserProfile'

const SettingsContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 30px;
`

export const LayoutUserProfile: FC = () => {
  const { state } = useStore()

  return (
    <SettingsContainer>
      {state.user && <UserProfile profile={state.user} />}
    </SettingsContainer>
  )
}
