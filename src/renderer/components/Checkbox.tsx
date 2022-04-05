import React, { type ChangeEventHandler, type FC, useCallback } from 'react'
import styled from 'styled-components'

const Input = styled.input`
  cursor: pointer;
`

const Label = styled.label`
  cursor: pointer;
`

export type CheckboxChangeHandler = (newValue: boolean) => void
interface Props {
  label: string
  id: string

  value: boolean
  onChange: CheckboxChangeHandler
}

export const Checkbox: FC<Props> = ({ label, id, value, onChange }) => {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ev => {
      if (typeof onChange !== 'function') return
      onChange(ev.target.checked)
    },
    [onChange]
  )

  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Input type='checkbox' id={id} checked={value} onChange={handleChange} />
    </>
  )
}
