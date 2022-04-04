import { faCheck, faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
  gap: 16px;
`

const IconsContainer = styled.div`
  position: relative;
  height: 24px;
  width: 24px;
`

interface IconProps {
  active: boolean
}

const SVGIcon = styled(FontAwesomeIcon)<IconProps>`
  cursor: pointer;
  position: absolute;

  height: 24px;
  width: auto;

  transition: opacity 0.1s ease;
  pointer-events: ${props => (props.active ? 'initial' : 'none')};
  opacity: ${props => (props.active ? '0.65' : '0')};

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 1;
  }
`

export const LayoutSettings: FC = () => {
  const { state, dispatch } = useStore()
  const handleSettingsToggle = useCallback(() => {
    dispatch({ type: 'toggleSettings' })
  }, [dispatch])

  return (
    <SettingsContainer>
      {state.user && <UserProfile profile={state.user} />}

      <IconsContainer>
        <SVGIcon
          title='Settings'
          active={!state.showSettings}
          icon={faGear}
          onClick={handleSettingsToggle}
        />

        <SVGIcon
          title='Hide Settings'
          active={state.showSettings}
          icon={faCheck}
          onClick={handleSettingsToggle}
        />
      </IconsContainer>
    </SettingsContainer>
  )
}
