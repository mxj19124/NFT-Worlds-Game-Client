import React, { type FC } from 'react'
import styled from 'styled-components'

const Progress = styled.div<Props>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${props => props.percent}%;
  height: ${props => props.height ?? 5}px;

  background-color: ${props => props.colour ?? '#111'};
`

interface Props {
  percent: number
  height?: number
  colour?: string

  children?: never
}

export const LoadBar: FC<Props> = ({ ...props }) => <Progress {...props} />
