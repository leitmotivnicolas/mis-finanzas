import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Replace window.storage with localStorage for web deployment
window.storage = {
  get: async (key) => {
    try {
      const value = localStorage.getItem(key)
      return value ? { key, value } : null
    } catch(e) { return null }
  },
  set: async (key, value) => {
    try {
      localStorage.setItem(key, value)
      return { key, value }
    } catch(e) { return null }
  },
  delete: async (key) => {
    try {
      localStorage.removeItem(key)
      return { key, deleted: true }
    } catch(e) { return null }
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
