import { shell } from '@electron/remote'
import React, { type FC, type PropsWithChildren, useCallback } from 'react'
import styled from 'styled-components'
import LogoImage from '../assets/images/logo.png'
import { BackgroundVideo } from './BackgroundVideo'
import { LayoutIcons } from './LayoutIcons'
import { LayoutUserProfile } from './LayoutUserProfile'

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

const LogoContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Logo = styled.img`
  width: 200px;
  height: auto;
  cursor: pointer;
`

const Children = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: hidden;
`

export const Layout: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const logoClicked = useCallback(() => {
    void shell.openExternal('https://nftworlds.com/')
  }, [])

  return (
    <>
      <Container>
        <TopBar>
          <LayoutIcons />

          <LogoContainer>
            <Logo src={LogoImage} onClick={logoClicked} />
          </LogoContainer>

          <LayoutUserProfile />
        </TopBar>

        <Children>{children}</Children>
      </Container>

      <BackgroundVideo />
    </>
  )
}
