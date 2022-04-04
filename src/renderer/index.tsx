import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { Provider } from './components/Store'
import './assets/fonts/OpenSans.css'

if (module.hot) {
  module.hot.dispose(() => root?.unmount())
  module.hot.accept()
}

const container = document.querySelector('#app')
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
)
