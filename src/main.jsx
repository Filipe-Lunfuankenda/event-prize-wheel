/**
 * Main Application Entry Point
 * This file is responsible for bootstrapping the React application and mounting it to the DOM.
 */

// Import core React libraries
import React from 'react'
import ReactDOM from 'react-dom/client'

// Import the root component that holds our routing and global context providers
import App from '@/App.jsx'

// Import global CSS styles (Tailwind utilities, custom variables, animations)
import '@/index.css'

/**
 * ReactDOM.createRoot
 * Creates a React root for the supplied container and returns the root.
 * We attach our app to the <div id="root"> element found in index.html.
 * 
 * Note: React.StrictMode is omitted here (or not used) to prevent double-rendering in development mode, 
 * which can sometimes interfere with complex canvas animations.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
