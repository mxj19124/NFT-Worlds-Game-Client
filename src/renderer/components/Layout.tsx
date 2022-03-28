import React, { type FC } from 'react'
import styled from 'styled-components'
import Logo from '../assets/images/logo.png'

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const Image = styled.img`
  width: 40%;
  margin-bottom: 16px;
`

const Children = styled.div`
  width: 100%;
  flex-grow: 1;
`

export const Layout: FC = ({ children }) => (
  <Container>
    <Image src={Logo} />

    <Children>{children}</Children>
  </Container>
)
