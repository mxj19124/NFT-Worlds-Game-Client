import React, { type FC, useCallback } from 'react'
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

export const LayoutSettings: FC = () => {
  const { state, dispatch } = useStore()
  const handleSettingsToggle = useCallback(() => {
    dispatch({ type: 'toggleSettings' })
  }, [dispatch])

  return (
    <SettingsContainer>
      {state.user && <UserProfile profile={state.user} />}

      {/* TODO: Replace with icons */}
      <button type='button' onClick={handleSettingsToggle}>
        {state.showSettings ? 'Back' : 'Settings'}
      </button>
    </SettingsContainer>
  )
}
