import React, { type ChangeEventHandler, type FC, useCallback } from 'react'
import styled from 'styled-components'
import { useStore } from '../hooks/useStore'
import { convertMemory } from '../ipc/launch'
import { MAX_MEMORY_GB } from '../lib/env'

type ChangeHandler = ChangeEventHandler<HTMLInputElement>

const Container = styled.div``

export const Settings: FC = () => {
  const { state, dispatch } = useStore()

  const onWidthChange = useCallback<ChangeHandler>(
    ev => {
      const value = Number.parseInt(ev.target.value, 10)
      dispatch({ type: 'setWidth', value })
    },
    [dispatch]
  )

  const onHeightChange = useCallback<ChangeHandler>(
    ev => {
      const value = Number.parseInt(ev.target.value, 10)
      dispatch({ type: 'setHeight', value })
    },
    [dispatch]
  )

  const onFullscreenChange = useCallback<ChangeHandler>(
    ev => {
      const value = ev.target.checked
      dispatch({ type: 'setFullscreen', value })
    },
    [dispatch]
  )

  const onMaxMemoryChange = useCallback<ChangeHandler>(
    ev => {
      const lowerBound = state.minMemoryGB + 1
      const value = Number.parseInt(ev.target.value, 10)

      const constrained = Math.max(lowerBound, value)
      dispatch({ type: 'setMaxMemory', value: constrained })
    },
    [state, dispatch]
  )

  const onMinMemoryChange = useCallback<ChangeHandler>(
    ev => {
      const upperBound = state.maxMemoryGB - 1
      const value = Number.parseInt(ev.target.value, 10)

      const constrained = Math.min(upperBound, value)
      dispatch({ type: 'setMinMemory', value: constrained })
    },
    [state, dispatch]
  )

  return (
    <Container>
      <h1>Window Options</h1>
      <input
        type='number'
        min={800}
        value={state.launchWidth}
        onChange={onWidthChange}
      />

      <input
        type='number'
        min={600}
        value={state.launchHeight}
        onChange={onHeightChange}
      />

      <input
        type='checkbox'
        checked={state.launchFullscreen}
        onChange={onFullscreenChange}
      />

      <h1>Memory Options</h1>
      <input
        type='range'
        min={0}
        max={MAX_MEMORY_GB}
        step={1}
        value={state.maxMemoryGB}
        onChange={onMaxMemoryChange}
      />

      <p>Max Memory: {convertMemory(state.maxMemoryGB)}</p>

      <input
        type='range'
        min={0}
        max={MAX_MEMORY_GB}
        step={1}
        value={state.minMemoryGB}
        onChange={onMinMemoryChange}
      />

      <p>Min Memory: {convertMemory(state.minMemoryGB)}</p>
    </Container>
  )
}
