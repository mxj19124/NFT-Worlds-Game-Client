import React, { type ChangeEventHandler, type FC, useCallback } from 'react'
import styled from 'styled-components'

const Input = styled.input``

export type NumberChangeHandler = (newValue: number) => void
interface Props {
  label: string

  min?: number
  max?: number
  value: number

  onChange: NumberChangeHandler
}

export const NumberInput: FC<Props> = ({
  label,
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
    <Input
      type='number'
      min={min}
      max={max}
      value={value}
      onChange={handleChange}
    />
  )
}
