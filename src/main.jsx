import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { checkAndClearCacheIfNeeded } from './utils/clearCache'

// Check for cache clear parameter on startup
checkAndClearCacheIfNeeded()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
