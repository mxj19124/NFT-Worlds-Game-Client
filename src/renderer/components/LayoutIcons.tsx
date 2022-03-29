import { type IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  faDiscord,
  faInstagram,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { shell } from 'electron'
import React, { type FC, useCallback } from 'react'
import styled from 'styled-components'

const IconsContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 40px;
`

const SVGIcon = styled(FontAwesomeIcon)`
  height: 24px;
  width: auto;
  margin: 0 30px;
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

interface IconProps {
  icon: IconProp
  href: string
  title?: string
}

const Icon: FC<IconProps> = ({ icon, href, title }) => {
  const onClick = useCallback(() => {
    void shell.openExternal(href)
  }, [href])

  return <SVGIcon title={title} icon={icon} onClick={onClick} />
}

export const LayoutIcons: FC = () => (
  <IconsContainer>
    <Icon
      title='Instagram'
      href='https://www.instagram.com/nftworldsnft'
      icon={faInstagram}
    />

    <Icon
      title='Twitter'
      href='https://twitter.com/nftworldsNFT'
      icon={faTwitter}
    />

    <Icon
      title='Discord'
      href='https://discord.com/invite/nft-worlds'
      icon={faDiscord}
    />
  </IconsContainer>
)
