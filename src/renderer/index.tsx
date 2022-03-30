import React from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { App } from './App'
import { Provider } from './components/Store'
import './assets/fonts/OpenSans.css'

if (module.hot) {
  module.hot.accept()
}

const container = document.querySelector('#app')

let root: Root | undefined
if (root === undefined) root = createRoot(container!)

root.render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
)
