import React from 'react'
import { render } from 'react-dom'

if (module.hot) {
  module.hot.accept()
}

render(<div />, document.querySelector('#app'))
