import { dialog, getCurrentWindow } from '@electron/remote'
import React, { type FC, useCallback, useMemo } from 'react'
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

const Heading = styled.h2`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;

  &:nth-child(2) {
    margin-top: 6px;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr fit-content(400px);
  column-gap: 10px;
`

export const Settings: FC = () => {
  const { state, dispatch } = useStore()
  const shadersEnabled = useMemo<boolean>(
    () =>
      state.disableShaders && !state.overrideDisableShaders
        ? false
        : state.launchShaders,
    [state.disableShaders, state.overrideDisableShaders, state.launchShaders]
  )

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
    async value => {
      if (state.disableShaders && !state.overrideDisableShaders) {
        const message =
          'Shaders have been automatically disabled for the following reason:\n' +
          `${state.disableShaders}\n\n` +
          'Enabling shaders may cause your game to fail to load, use at your own risk.\n' +
          'Would you like to enable shaders anyway?'

        const win = getCurrentWindow()
        const { response } = await dialog.showMessageBox(win, {
          type: 'warning',
          title: win.title,
          message,
          buttons: ['OK', 'Cancel'],
        })

        if (response === 0) {
          dispatch({ type: 'setShaders', value: true })
          dispatch({ type: 'setOverrideDisableShaders', value: true })
        }
      } else {
        dispatch({ type: 'setShaders', value })
      }
    },
    [state.disableShaders, state.overrideDisableShaders, dispatch]
  )

  return (
    <Container>
      <Header>Settings</Header>

      <Heading>Minecraft Window Size</Heading>
      <Grid>
        <NumberInput
          label='Width'
          id='width'
          min={800}
          value={state.launchWidth}
          onChange={onWidthChange}
        />

        <NumberInput
          label='Height'
          id='height'
          min={600}
          value={state.launchHeight}
          onChange={onHeightChange}
        />

        <Checkbox
          label='Launch Fullscreen'
          id='fullscreen'
          value={state.launchFullscreen}
          onChange={onFullscreenChange}
        />
      </Grid>

      <Heading>Java Memory Allocation</Heading>
      <DoubleSlider
        min={0}
        max={MAX_MEMORY_GB}
        step={1}
        minValue={state.minMemoryGB}
        maxValue={state.maxMemoryGB}
        onMinChange={onMinMemoryChange}
        onMaxChange={onMaxMemoryChange}
      />

      <span>Min Memory: {convertMemory(state.minMemoryGB)}</span>
      <br />
      <span>Max Memory: {convertMemory(state.maxMemoryGB)}</span>

      <Heading>Enabled Resources</Heading>
      <Grid>
        <Checkbox
          label='Enable Shaders'
          id='shaders'
          value={shadersEnabled}
          onChange={onShadersChange}
        />
      </Grid>
    </Container>
  )
}
