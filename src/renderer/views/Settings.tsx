import React, { type FC, useCallback } from 'react'
import styled from 'styled-components'
import { Checkbox, type CheckboxChangeHandler } from '../components/Checkbox'
import {
  DoubleSlider,
  type RangeEndChangeHandler,
} from '../components/DoubleSlider'
import {
  type NumberChangeHandler,
  NumberInput,
} from '../components/NumberInput'
import { useStore } from '../hooks/useStore'
import { convertMemory } from '../ipc/launch'
import { MAX_MEMORY_GB } from '../lib/env'

const Container = styled.div``

export const Settings: FC = () => {
  const { state, dispatch } = useStore()

  const onWidthChange = useCallback<NumberChangeHandler>(
    value => dispatch({ type: 'setWidth', value }),
    [dispatch]
  )

  const onHeightChange = useCallback<NumberChangeHandler>(
    value => dispatch({ type: 'setHeight', value }),
    [dispatch]
  )

  const onFullscreenChange = useCallback<CheckboxChangeHandler>(
    value => dispatch({ type: 'setFullscreen', value }),
    [dispatch]
  )

  const onMinMemoryChange = useCallback<RangeEndChangeHandler>(
    value => dispatch({ type: 'setMinMemory', value }),
    [dispatch]
  )

  const onMaxMemoryChange = useCallback<RangeEndChangeHandler>(
    value => dispatch({ type: 'setMaxMemory', value }),
    [dispatch]
  )

  const onShadersChange = useCallback<CheckboxChangeHandler>(
    value => dispatch({ type: 'setShaders', value }),
    [dispatch]
  )

  return (
    <Container>
      <h1>Window Options</h1>
      <NumberInput
        label='Window Width'
        min={800}
        value={state.launchWidth}
        onChange={onWidthChange}
      />

      <NumberInput
        label='Window Height'
        min={600}
        value={state.launchHeight}
        onChange={onHeightChange}
      />

      <Checkbox
        label='Launch Fullscreen'
        value={state.launchFullscreen}
        onChange={onFullscreenChange}
      />

      <h1>Memory Options</h1>
      <DoubleSlider
        min={0}
        max={MAX_MEMORY_GB}
        step={1}
        minValue={state.minMemoryGB}
        maxValue={state.maxMemoryGB}
        onMinChange={onMinMemoryChange}
        onMaxChange={onMaxMemoryChange}
      />

      <p>Max Memory: {convertMemory(state.maxMemoryGB)}</p>
      <p>Min Memory: {convertMemory(state.minMemoryGB)}</p>

      <h1>Resource Options</h1>
      <Checkbox
        label='Enable Shaders'
        value={state.launchShaders}
        onChange={onShadersChange}
      />
    </Container>
  )
}
