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
  --size: 44px;

  width: var(--size);
  height: var(--size);
  image-rendering: pixelated;
  border-radius: 50%;
  border: 2px #ebebeb solid;
`

const TextContainer = styled.p`
  position: relative;

  height: 100%;
  min-width: 100px;
  margin-right: 10px;

  display: flex;
  flex-direction: column;

  --translation: 30%;
  transition: color 0.1s ease, transform 0.1s ease;

  *:hover > & {
    transform: translateY(calc(-1 * var(--translation)));
    color: rgba(255, 255, 255, 0);
  }

  &::after {
    content: 'Log Out';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;

    color: rgba(255, 255, 255, 0);
    transform: translateY(var(--translation));

    font-size: 20px;
    font-weight: 600;

    *:hover > & {
      color: white;
    }
  }
`

const Text = styled.span`
  margin: 0;
  text-align: right;
`

const Name = styled(Text)`
  font-size: 18px;
  font-weight: 600;
`

const Balance = styled(Text)`
  font-size: 12px;
  font-weight: 600;
  color: rgb(230, 230, 230);

  *:hover > * > & {
    color: rgba(255, 255, 255, 0);
  }
`

interface Props {
  profile: Profile
  balance: number
}

export const PlayerProfile: FC<Props> = ({ profile, balance: rawBalance }) => {
  const { dispatch } = useStore()
  const balance = useMemo<string>(() => rawBalance.toFixed(2), [rawBalance])

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
      <TextContainer>
        <Name>{profile.name}</Name>
        <Balance>{balance} $WRLD</Balance>
      </TextContainer>
      <PlayerHead src={playerHead} />
    </Container>
  )
}
