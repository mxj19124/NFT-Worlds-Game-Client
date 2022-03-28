import React, { type FC } from 'react'
import styled from 'styled-components'
import LogoImage from '../assets/images/logo.png'
import { useStore } from '../hooks/useStore'

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const TopBar = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  margin-top: 30px;
`

const IconsContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 30px;
`

const LogoContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Logo = styled.img`
  width: 200px;
  height: auto;
`

const SettingsContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 30px;
`

const Children = styled.div`
  width: 100%;
  flex-grow: 1;
`

export const Layout: FC = ({ children }) => {
  const { state } = useStore()

  return (
    <Container>
      <TopBar>
        <IconsContainer>icons</IconsContainer>

        <LogoContainer>
          <Logo src={LogoImage} />
        </LogoContainer>

        <SettingsContainer>settings</SettingsContainer>
      </TopBar>

      <Children>{children}</Children>
    </Container>
  )
}
