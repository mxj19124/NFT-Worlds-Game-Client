import { type IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  faDiscord,
  faInstagram,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { faCheck, faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { shell } from 'electron'
import React, { type CSSProperties, type FC, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useStore } from '../hooks/useStore'

const IconsContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 40px;

  --icon-width: 24px;
  --icon-margin: 24px;
`

const SVGIcon = styled(FontAwesomeIcon)`
  height: var(--icon-width);
  width: auto;
  margin: 0 var(--icon-margin);
  cursor: pointer;

  transition: opacity 0.1s ease;
  opacity: 0.65;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 1;
  }

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`

interface CommonIconProps {
  icon: IconProp
  title?: string

  style?: CSSProperties
  className?: string
}

interface LinkIconProps extends CommonIconProps {
  type: 'link'

  href: string
  onClick?: never
}

interface ClickIconProps extends CommonIconProps {
  type: 'click'

  href?: never
  onClick: () => void
}

type IconProps = LinkIconProps | ClickIconProps
const Icon: FC<IconProps> = ({
  icon,
  title,
  type,
  href,
  onClick,
  style,
  className,
}) => {
  const handleClick = useCallback(() => {
    if (type === 'link') void shell.openExternal(href)
    else onClick()
  }, [type, href, onClick])

  return (
    <SVGIcon
      title={title}
      icon={icon}
      style={style}
      className={className}
      onClick={handleClick}
    />
  )
}

const SettingsIconsContainer = styled.div`
  position: relative;
  height: var(--icon-width);
  width: var(--icon-width);
  margin: 0 var(--icon-margin);

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`

interface SettingsIconProps {
  active: boolean
  disabled: boolean
}

const SettingsIcon = styled(Icon)<SettingsIconProps>`
  position: absolute;
  margin: 0;

  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${props => (props.active ? 'initial' : 'none')};
  opacity: ${props => (props.active ? (props.disabled ? '0.3' : '0.65') : '0')};

  &:hover {
    ${props => (props.disabled ? 'opacity: 0.3;' : '')}
  }
`

export const LayoutIcons: FC = () => {
  const { state, dispatch } = useStore()
  const enableSettings = useMemo<boolean>(
    () => state.status === 'idle',
    [state.status]
  )

  const handleSettingsToggle = useCallback(() => {
    if (enableSettings) dispatch({ type: 'toggleSettings' })
  }, [enableSettings, dispatch])

  return (
    <IconsContainer>
      <SettingsIconsContainer>
        <SettingsIcon
          type='click'
          title='Settings'
          active={!state.showSettings}
          disabled={!enableSettings}
          icon={faGear}
          onClick={handleSettingsToggle}
        />

        <SettingsIcon
          type='click'
          title='Hide Settings'
          active={state.showSettings}
          disabled={!enableSettings}
          icon={faCheck}
          onClick={handleSettingsToggle}
        />
      </SettingsIconsContainer>

      <Icon
        type='link'
        title='Instagram'
        href='https://www.instagram.com/nftworldsnft'
        icon={faInstagram}
      />

      <Icon
        type='link'
        title='Twitter'
        href='https://twitter.com/nftworldsNFT'
        icon={faTwitter}
      />

      <Icon
        type='link'
        title='Discord'
        href='https://discord.com/invite/nft-worlds'
        icon={faDiscord}
      />
    </IconsContainer>
  )
}
