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
`

const Children = styled.div`
  width: 100%;
`

export const Layout: FC = ({ children }) => (
  <Container>
    <Image src={Logo} />

    <Children>{children}</Children>
  </Container>
)
