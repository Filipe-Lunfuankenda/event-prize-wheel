/**
 * Vite Configuration File
 * This file configures the Vite bundler, which serves and builds the React application.
 * It integrates the React plugin and the VitePWA plugin to enable offline support and installability.
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { VitePWA } from 'vite-plugin-pwa'

// Resolve __dirname in ES modules context since this is a module environment
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Enables React Fast Refresh and JSX transformation
    react(),
    
    // Configures the Progressive Web App (PWA) features
    VitePWA({
      // Automatically updates the service worker when a new version is deployed
      registerType: 'autoUpdate',
      
      // Assets that should be precached alongside the standard bundle
      includeAssets: ['favicon.ico'],
      
      // The Web App Manifest defines how the app appears when installed on a device
      manifest: {
        name: 'Event Prize Wheel',
        short_name: 'Prize Wheel',
        description: 'Spin the wheel and win prizes at your next tech event!',
        theme_color: '#0a192f', // Matches the deep blue background of the app
        background_color: '#0a192f',
        display: 'standalone', // Hides browser UI components (URL bar) when launched
        orientation: 'portrait-primary', // Locks the app to portrait mode if possible
        start_url: '/',
        scope: '/',
        lang: 'en',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icon-192.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      
      // Workbox configuration for Service Worker caching strategies
      workbox: {
        // Files to cache immediately for offline access
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        
        // Fallback to index.html for React Router compatibility (client-side routing)
        navigateFallback: '/index.html',
        
        // Runtime caching for external resources (like fonts or external APIs)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\//i,
            handler: 'NetworkFirst', // Tries network first, falls back to cache if offline
            options: { cacheName: 'external-cache', expiration: { maxEntries: 50 } },
          },
        ],
      },
    }),
  ],
  
  // Path resolution configuration
  resolve: {
    alias: {
      // Allows using '@/' as a shortcut for the 'src/' directory in imports
      "@": path.resolve(__dirname, "./src"),
    },
  },
});