import React from 'react'
import ReactDOM from 'react-dom/client'
// The main application code is contained within App.jsx
import App from './App.jsx'

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
