/**
 * Main application entry point
 *
 * [DesignPattern: Module] This file serves as the main entry point for the React application,
 * following the Module pattern by organizing code into separate, reusable components.
 */

// #region Imports
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App'
import './index.css'
// #endregion

// #region Render Application
// Render the root component to the DOM using the createRoot API for React 18+
const rootElement = document.getElementById('root')

// Type check to ensure root element exists
if (!rootElement) {
  throw new Error('Failed to find the root element')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
// #endregion
