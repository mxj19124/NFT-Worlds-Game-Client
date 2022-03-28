import deepEqual from 'fast-deep-equal/es6'
import React, {
  type FC,
  type Reducer,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { usePrevious } from '../hooks/usePrevious'
import { initState, persist } from '../state/persist'
import {
  type Action,
  initialState,
  reducer,
  type State,
} from '../state/reducer'
import { store } from '../state/store'

export const Provider: FC = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<State, Action>, State>(
    reducer,
    initialState,
    initState
  )

  const previousState = usePrevious(state)
  useEffect(() => {
    const stateEqual = deepEqual(previousState, state)
    if (!stateEqual) {
      persist(state)
    }
  }, [previousState, state])

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])
  return <store.Provider value={value}>{children}</store.Provider>
}
