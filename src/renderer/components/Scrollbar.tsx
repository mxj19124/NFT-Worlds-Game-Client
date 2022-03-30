import { createGlobalStyle } from 'styled-components'

export const Scrollbar = createGlobalStyle`
::-webkit-scrollbar {
  width: 13px;
  height: 0;
}

::-webkit-scrollbar-thumb {
  height: 1em;
  border: 4px solid transparent;
  background-clip: padding-box;
  border-radius: 50px;
  box-shadow: inset 0 0 0 1px transparent;
  background-color: rgba(0, 0, 0, 0.5);
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.55);
}

::-webkit-scrollbar-thumb:active {
  background-color: rgba(0, 0, 0, 0.65);
}

::-webkit-scrollbar-button {
  width: 0;
  height: 0;
  display: none;
}

::-webkit-scrollbar-corner {
  background-color: transparent;
}
`
