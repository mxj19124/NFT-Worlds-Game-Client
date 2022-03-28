import { type FC, useEffect } from 'react'
import { useStore } from './hooks/useStore'
import { init } from './state/init'

export const App: FC = () => {
  // Initialise the store
  const { state, dispatch } = useStore()
  useEffect(() => {
    void init(state, dispatch)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  // TODO: Render a view
  return null
}
