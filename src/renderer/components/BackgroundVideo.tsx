import React, { type FC } from 'react'
import styled from 'styled-components'
import Background from '../assets/media/background.mp4'

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

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.45);
`

export const BackgroundVideo: FC<{ children?: never }> = () => (
  <VideoContainer>
    <Video autoPlay loop src={Background} />
  </VideoContainer>
)
