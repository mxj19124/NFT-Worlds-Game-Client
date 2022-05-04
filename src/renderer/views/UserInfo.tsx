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

export const UserInfo: FC = () => {
  const { dispatch } = useStore()
  const handleLogout = useCallback(() => {
    dispatch({ type: 'clearUser' })
    dispatch({ type: 'toggleUserInfo' })
  }, [dispatch])

  return (
    <Container>
      <Header>Profile</Header>
      <button type='button' onClick={handleLogout}>
        Log Out
      </button>
    </Container>
  )
}
