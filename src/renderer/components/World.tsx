import React, { FC, useCallback, useMemo } from 'react'
import styled from 'styled-components'

const Container = styled.div<{ inactive: boolean }>`
  width: 250px;
  padding: 14px;

  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #1a1a1a;
  border-radius: 8px;
  border: 1px #292929 solid;

  & > * {
    opacity: ${props => (props.inactive ? '0.5' : 'initial')};
    --grayscale: ${props => (props.inactive ? '90%' : '0%')};
    --brightness: ${props => (props.inactive ? '70%' : '100%')};
  }
`

const Banner = styled.img`
  width: 100%;
  aspect-ratio: 2.4;
  object-fit: cover;

  border-radius: 8px;
  border: 2px #333333 solid;

  opacity: 1;
  filter: grayscale(var(--grayscale)) brightness(var(--brightness));
`

const Icon = styled.img`
  --size: 56px;
  width: var(--size);
  height: var(--size);
  object-fit: cover;
  margin-top: calc(var(--size) / -2);

  border-radius: 50%;
  border: 2px #333333 solid;

  opacity: 1;
  filter: grayscale(var(--grayscale)) brightness(var(--brightness));
`

const WorldName = styled.h1`
  margin: 0;
  margin-top: 8px;
  font-size: 18px;
`

const WorldID = styled.h2`
  margin: 0;
  font-size: 11px;
  color: #aaa;
`

const PlayerCount = styled(WorldID)`
  margin-top: 1px;
`

const Description = styled.p`
  margin: 0;
  margin-top: 6px;
  margin-bottom: 14px;

  font-size: 12px;
  font-weight: 600;
  text-align: center;

  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`

const LaunchButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  margin: 0;
  margin-top: auto;
  padding: 8px;

  border: none;
  border-radius: 5px;

  font-family: inherit;
  font-size: 14px;
  font-weight: bold;

  color: white;
  background-image: linear-gradient(rgb(29, 120, 255), rgb(0, 102, 255));

  cursor: ${props => (props.disabled ? 'initial' : 'pointer')};
  opacity: ${props => (props.disabled ? '0.5 !important' : '1')};
  transition: opacity 0.1s ease;

  &:active {
    opacity: 0.5;
  }
`

interface Props {
  world: NFTWorlds.World
  offline: boolean
  disabled: boolean

  onLaunch: (world: NFTWorlds.World) => void
}

export const World: FC<Props> = ({ world, offline, disabled, onLaunch }) => {
  const inactive = useMemo<boolean>(
    () => offline || disabled,
    [offline, disabled]
  )

  const buttonText = useMemo<string>(
    () => (offline ? 'Offline' : 'Launch'),
    [offline]
  )

  const onClick = useCallback(() => {
    if (!inactive) onLaunch(world)
  }, [world, inactive, onLaunch])

  return (
    <Container inactive={inactive}>
      <Banner src={world.branding.banner} />
      <Icon src={world.branding.icon} />

      <WorldName>{world.name}</WorldName>
      <WorldID>World #{world.worldId}</WorldID>
      <PlayerCount>{world.playersOnline} Players Online</PlayerCount>
      <Description>{world.description}</Description>

      <LaunchButton type='button' disabled={inactive} onClick={onClick}>
        {buttonText}
      </LaunchButton>
    </Container>
  )
}
