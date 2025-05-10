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
import App from './App.jsx'
import './index.css'
// #endregion

// #region Render Application
// Render the root component to the DOM using the createRoot API for React 18+
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
// #endregion
