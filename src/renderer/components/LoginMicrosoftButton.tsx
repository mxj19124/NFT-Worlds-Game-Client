import React, { type FC, useCallback } from 'react'
import styled from 'styled-components'
import SVG from '../assets/svg/microsoft-login.svg'

const Image = styled.img<Props>`
  width: 100%;
  box-shadow: 0 4px 8px 0px #000000a6;
  border-radius: 5px;
  transition: transform 0.2s ease;

  opacity: ${props => (props.disabled ? '0.7' : '1')};
  cursor: ${props => (props.disabled ? 'initial' : 'pointer')};

  &:hover {
    transform: ${props => (props.disabled ? 'none' : 'scale(102%)')};
  }
`

interface Props {
  disabled?: boolean
  onClick: () => void

  children?: never
}

export const LoginMicrosoftButton: FC<Props> = ({ disabled, onClick }) => {
  const handleClick = useCallback(() => {
    if (!disabled) onClick()
  }, [disabled, onClick])

  return <Image disabled={disabled} src={SVG} onClick={handleClick} />
}
