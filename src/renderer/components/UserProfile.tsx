import { type profile as Profile } from 'msmc'
import React, { type FC, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useStore } from '../hooks/useStore'

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const PlayerHead = styled.img`
  width: 42px;
  height: 42px;
  image-rendering: pixelated;
  border-radius: 50%;
  border: 2px white solid;
`

const Name = styled.p`
  position: relative;
  font-size: 20px;
  font-weight: 600;
  margin-right: 10px;
  transition: color 0.1s ease, transform 0.1s ease;

  *:hover > & {
    transform: translateY(-100%);
    color: rgba(255, 255, 255, 0);
  }

  &::after {
    content: 'Log Out';
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(100%);
    color: rgba(255, 255, 255, 0);
    transition: color 0.1s ease, transform 0.1s ease;

    *:hover > & {
      color: white;
    }
  }
`

interface Props {
  profile: Profile
}

export const UserProfile: FC<Props> = ({ profile }) => {
  const { dispatch } = useStore()
  const playerHead = useMemo<string>(
    () =>
      `https://crafatar.com/avatars/${profile.id}?size=32&default=MHF_Steve&overlay`,
    [profile.id]
  )

  const handleLogout = useCallback(() => {
    dispatch({ type: 'clearUser' })
  }, [dispatch])

  return (
    <Container onClick={handleLogout}>
      <Name>{profile.name}</Name>
      <PlayerHead src={playerHead} />
    </Container>
  )
}
