import React, { type FC } from 'react'
import styled from 'styled-components'
import { Layout } from '../components/Layout'
import { LoginMicrosoftButton } from '../components/LoginMicrosoftButton'

const VerticalLayout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`

export const Login: FC<{ children?: never }> = () => {
  return (
    <Layout>
      <VerticalLayout>
        <LoginMicrosoftButton />
      </VerticalLayout>
    </Layout>
  )
}
