import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './style.css'

console.log('main.jsx: Starting app...')

const root = ReactDOM.createRoot(document.getElementById('app'))
console.log('main.jsx: Root created, rendering App...')

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

console.log('main.jsx: App rendered!')
