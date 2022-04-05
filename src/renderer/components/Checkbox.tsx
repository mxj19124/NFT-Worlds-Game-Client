import React, { type ChangeEventHandler, type FC, useCallback } from 'react'
import styled from 'styled-components'

const Input = styled.input``

export type CheckboxChangeHandler = (newValue: boolean) => void
interface Props {
  label: string
  value: boolean

  onChange: CheckboxChangeHandler
}

export const Checkbox: FC<Props> = ({ label, value, onChange }) => {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ev => {
      if (typeof onChange !== 'function') return
      onChange(ev.target.checked)
    },
    [onChange]
  )

  return <Input type='checkbox' checked={value} onChange={handleChange} />
}
