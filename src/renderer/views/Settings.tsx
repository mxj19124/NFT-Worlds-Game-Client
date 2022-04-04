import React, { type ChangeEventHandler, type FC, useCallback } from 'react'
import styled from 'styled-components'
import { useStore } from '../hooks/useStore'

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
    </Container>
  )
}
