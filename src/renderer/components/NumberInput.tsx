import React, { type ChangeEventHandler, type FC, useCallback } from 'react'
import styled from 'styled-components'

const Input = styled.input`
  max-width: 100px;
`

const Label = styled.label``

export type NumberChangeHandler = (newValue: number) => void
interface Props {
  label: string
  id: string

  min?: number
  max?: number
  value: number

  onChange: NumberChangeHandler
}

export const NumberInput: FC<Props> = ({
  label,
  id,
  min,
  max,
  value,
  onChange,
}) => {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ev => {
      if (typeof onChange !== 'function') return

      const value = Number.parseInt(ev.target.value, 10)
      onChange(value)
    },
    [onChange]
  )

  return (
    <>
      <Label htmlFor={id}>{label}</Label>

      <Input
        type='number'
        id={id}
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
      />
    </>
  )
}
