import React, { type ChangeEventHandler, type FC, useCallback } from 'react'

type ChangeHandler = ChangeEventHandler<HTMLInputElement>
export type RangeEndChangeHandler = (newValue: number) => void
export type RangeChangeHandler = (newMin: number, newMax: number) => void

interface Props {
  min: number
  max: number
  step: number

  minValue: number
  maxValue: number

  onMinChange?: RangeEndChangeHandler
  onMaxChange?: RangeEndChangeHandler
  onChange?: RangeChangeHandler
}

export const DoubleSlider: FC<Props> = ({
  min,
  max,
  step,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  onChange,
}) => {
  const handleMinChange = useCallback<ChangeHandler>(
    ev => {
      const value = Number.parseInt(ev.target.value, 10)
      const upperBound = maxValue - 1

      const constrained = Math.min(upperBound, value)
      if (typeof onMinChange === 'function') onMinChange(constrained)
      if (typeof onChange === 'function') onChange(constrained, maxValue)
    },
    [maxValue, onMinChange, onChange]
  )

  const handleMaxChange = useCallback<ChangeHandler>(
    ev => {
      const value = Number.parseInt(ev.target.value, 10)
      const lowerBound = minValue + 1

      const constrained = Math.max(lowerBound, value)
      if (typeof onMaxChange === 'function') onMaxChange(constrained)
      if (typeof onChange === 'function') onChange(minValue, constrained)
    },
    [minValue, onMaxChange, onChange]
  )

  return (
    <div>
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={handleMinChange}
      />

      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={handleMaxChange}
      />
    </div>
  )
}
