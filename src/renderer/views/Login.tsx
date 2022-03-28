import React, { type FC } from 'react'
import { LoginMicrosoftButton } from '../components/LoginMicrosoftButton'

export const Login: FC<{ children?: never }> = () => {
  return (
    <div>
      <LoginMicrosoftButton />
    </div>
  )
}
