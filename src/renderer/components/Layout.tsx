import { shell } from '@electron/remote'
import React, { type FC, useCallback } from 'react'
import styled from 'styled-components'
import LogoImage from '../assets/images/logo.png'
import Background from '../assets/media/background.mp4'
import { LayoutIcons } from './LayoutIcons'
import { LayoutSettings } from './LayoutSettings'

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
  flex-grow: 1;
`

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
  z-index: -1000;
  pointer-events: none;
`

const BackgroundVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.45);
`

export const Layout: FC = ({ children }) => {
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

          <LayoutSettings />
        </TopBar>

        <Children>{children}</Children>
      </Container>

      <VideoContainer>
        <BackgroundVideo autoPlay loop src={Background} />
      </VideoContainer>
    </>
  )
}
