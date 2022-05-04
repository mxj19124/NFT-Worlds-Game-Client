import React, { type FC, useCallback } from 'react'
import styled from 'styled-components'
import { useStore } from '../hooks/useStore'

const Container = styled.div`
  --spacing: 20px;
  --margin-top: 18px;

  margin: var(--spacing) auto;
  padding: var(--spacing);
  margin-top: var(--margin-top);

  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  width: fit-content;
`

const Header = styled.h1`
  margin: 0;
  margin-top: -4px;

  text-align: center;
`

const Heading = styled.h2`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;

  &:nth-child(2) {
    margin-top: 6px;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr fit-content(400px);
  column-gap: 10px;
  align-items: baseline;
`

const Mono = styled.code<{ lower?: boolean }>`
  font-size: 0.9rem;
  text-transform: ${props => (props.lower ? 'lowercase' : 'initial')};
`

export const UserInfo: FC = () => {
  const { state, dispatch } = useStore()
  if (!state.user) throw new Error('user is undefined')
  if (!state.wallets) throw new Error('wallets is undefined')

  const handleLogout = useCallback(() => {
    dispatch({ type: 'clearUser' })
    dispatch({ type: 'toggleUserInfo' })
  }, [dispatch])

  return (
    <Container>
      <Header>Profile</Header>

      <Heading>Wallet</Heading>
      <Grid>
        <span>Primary Address</span>
        <Mono lower>{state.wallets.primaryWalletAddress}</Mono>

        <span>Balance</span>
        <Mono>{state.wallets.wrldBalance.toFixed(2)} $WRLD</Mono>
      </Grid>

      <br />
      <button type='button' onClick={handleLogout}>
        Log Out
      </button>
    </Container>
  )
}
