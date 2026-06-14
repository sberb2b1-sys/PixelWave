import './assets/styles/variables.css'
import './utils/variables.js'
import './assets/styles/global.css'
import './assets/styles/font.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
