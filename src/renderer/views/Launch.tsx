import React, {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import styled from 'styled-components'
import { LoadBar } from '../components/LoadBar'
import { Worlds } from '../components/Worlds'
import { useStore } from '../hooks/useStore'
import { convertMemory, launch, launchEvents } from '../ipc/launch'

const StatusOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  padding: 12px 10px;
  padding-bottom: 16px;
  backdrop-filter: blur(2px);

  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
`

const Task = styled.span`
  text-transform: capitalize;
`

export const Launch: FC = () => {
  const { state, dispatch } = useStore()
  if (!state.user) throw new Error('Launch view rendered with no user')
  if (!state.worlds) throw new Error('Launch view rendered with no worlds')
  if (state.worlds instanceof Error) {
    throw new TypeError('Launch view rendered with worlds error')
  }

  const [progress, setProgress] = useState<number | undefined>()
  const [status, setStatus] = useState<string | undefined>()
  const [task, setTask] = useState<string | undefined>()

  const disabled = useMemo<boolean>(
    () => state.status === 'gameRunning' || state.status === 'gameLaunching',
    [state]
  )

  const onOpen = useCallback(() => {
    setProgress(undefined)
    setStatus('Game is running')
    setTask(undefined)

    dispatch({ type: 'setStatus', value: 'gameRunning' })
  }, [dispatch])

  const onUpdate = useCallback((message: string, percentage: number) => {
    setProgress(percentage * 100)
    setStatus(message)
    setTask(undefined)
  }, [])

  const onProgress = useCallback(
    (type: string, task: number, total: number) => {
      if (status !== 'Downloading Minecraft') return
      setTask(`${type} [${task} / ${total}]`)
    },
    [status]
  )

  const onDataDebug = useCallback((message: string) => {
    console.log(message)
  }, [])

  const onClose = useCallback(() => {
    setProgress(undefined)
    setStatus(undefined)
    setTask(undefined)

    dispatch({ type: 'setStatus', value: 'idle' })
  }, [dispatch])

  useEffect(() => {
    launchEvents.addListener('open', onOpen)
    launchEvents.addListener('update', onUpdate)
    launchEvents.addListener('progress', onProgress)
    launchEvents.addListener('data', onDataDebug)
    launchEvents.addListener('debug', onDataDebug)
    launchEvents.addListener('close', onClose)

    return () => {
      launchEvents.removeListener('open', onOpen)
      launchEvents.removeListener('update', onUpdate)
      launchEvents.removeListener('progress', onProgress)
      launchEvents.removeListener('data', onDataDebug)
      launchEvents.removeListener('debug', onDataDebug)
      launchEvents.removeListener('close', onClose)
    }
  }, [onOpen, onUpdate, onProgress, onDataDebug, onClose])

  const launchWorld = useCallback(
    (world: NFTWorlds.World) => {
      if (!state.user) throw new Error('Launch requested with no user')
      if (!state.worlds) throw new Error('Launch requested with no worlds')
      if (state.worlds instanceof Error) {
        throw new TypeError('Launch requested with worlds error')
      }

      const options: IPC.LaunchOptions = {
        width: state.launchWidth,
        height: state.launchHeight,
        fullscreen: state.launchFullscreen,

        memory: {
          max: convertMemory(state.maxMemoryGB),
          min: convertMemory(state.minMemoryGB),
        },

        enableShaders:
          state.disableShaders && !state.overrideDisableShaders
            ? false
            : state.launchShaders,
      }

      dispatch({ type: 'setStatus', value: 'gameLaunching' })
      void launch(state.user, options, world, state.worlds)
    },
    [state, dispatch]
  )

  return (
    <>
      <Worlds
        worlds={state.worlds}
        disabled={disabled}
        launchWorld={launchWorld}
      />

      {status && (
        <StatusOverlay>
          {status}

          {task && (
            <>
              {' - '}
              <Task>{task}</Task>
            </>
          )}
        </StatusOverlay>
      )}
      {progress && (
        <LoadBar colour='rgba(255, 255, 255, 0.5)' percent={progress} />
      )}
    </>
  )
}
