// ─── Entry Point ───────────────────────────────────────────
// Purpose: The very first JavaScript file that runs.
// It mounts our React app into the DOM (the HTML page).
// StrictMode helps catch potential issues during development.
// ────────────────────────────────────────────────────────────

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
