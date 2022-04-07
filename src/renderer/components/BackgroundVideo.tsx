import React, { type FC, useCallback, useEffect, useRef } from 'react'
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

export const BackgroundVideo: FC = () => {
  const ref = useRef<HTMLVideoElement>(null)

  const onFocus = useCallback(() => {
    void ref.current?.play()
  }, [])

  const onFocusLost = useCallback(() => {
    ref.current?.pause()
  }, [])

  useEffect(() => {
    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onFocusLost)

    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onFocusLost)
    }
  }, [onFocus, onFocusLost])

  return (
    <VideoContainer>
      <Video ref={ref} autoPlay loop src={Background} />
    </VideoContainer>
  )
}
