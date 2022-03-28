import { type update as Update } from 'msmc'
import React, {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import styled from 'styled-components'
import SVG from '../assets/svg/microsoft-login.svg'
import { useStore } from '../hooks/useStore'
import { login, loginEvents } from '../ipc/auth'

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

interface ImageProps {
  disabled: boolean
}

const Image = styled.img<ImageProps>`
  width: 300px;
  box-shadow: 0 4px 8px 0px #000000a6;
  transition: transform 0.2s ease;

  opacity: ${props => (props.disabled ? '0.5' : '1')};
  cursor: ${props => (props.disabled ? 'initial' : 'pointer')};

  &:hover {
    transform: ${props => (props.disabled ? 'none' : 'scale(102%)')};
  }
`

interface ProgressProps {
  progress: number | undefined
}

const Progress = styled.div<ProgressProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${props => props.progress ?? 0}%;
  height: 5px;

  background-color: #0084ff;
`

export const LoginMicrosoftButton: FC<{ children?: never }> = () => {
  const { state, dispatch } = useStore()
  const disabled = useMemo<boolean>(
    () => state.status === 'authenticating',
    [state]
  )

  const [progress, setProgress] = useState<number | undefined>()
  const [status, setStatus] = useState<string | undefined>()

  const onUpdate = useCallback((update: Update) => {
    if (update.percent) setProgress(update.percent)
    if (update.data) setStatus(update.data)
  }, [])

  useEffect(() => {
    loginEvents.addListener('update', onUpdate)

    return () => {
      loginEvents.removeListener('update', onUpdate)
    }
  }, [onUpdate])

  const handleLogin = useCallback(() => {
    dispatch({ type: 'setStatus', value: 'authenticating' })

    void login()
      .then(profile => {
        dispatch({ type: 'setUser', value: profile })
      })
      .catch(console.error)
      .finally(() => {
        setProgress(undefined)
        setStatus(undefined)

        dispatch({ type: 'setStatus', value: 'idle' })
      })
  }, [dispatch])

  return (
    <Container>
      <p>{status}</p>
      <Image disabled={disabled} src={SVG} onClick={handleLogin} />

      <Progress progress={progress} />
    </Container>
  )
}
