/**
 * Root Application Component
 * This component sets up the fundamental providers and routing logic for the entire app.
 */

// Import Toast provider for displaying notifications across the app
import { Toaster } from "@/components/ui/toaster"

// React Query setup for data fetching/caching (if any API requests are made later)
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'

// React Router setup for navigating between pages without reloading the browser
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import Pages and Global UI Components
import PageNotFound from './lib/PageNotFound'; // 404 Fallback page
import Home from './pages/Home';               // Main landing page (Gatekeeper)
import Roleta from './pages/Roleta';           // The actual Wheel of Fortune page
import FullscreenButton from './components/FullscreenButton'; // Global button to trigger PWA fullscreen

function App() {
  return (
    // Wrap the app in QueryClientProvider to allow hooks like useQuery to work anywhere
    <QueryClientProvider client={queryClientInstance}>
      
      {/* 
        BrowserRouter manages the URL history. 
        It synchronizes the UI with the browser's current URL.
      */}
      <Router>
        
        {/* 
          Routes is a container that looks through its children <Route>s and 
          renders the first one that matches the current URL.
        */}
        <Routes>
          {/* Default Route: Displays the Home/Landing page when users visit '/' */}
          <Route path="/" element={<Home />} />
          
          {/* Wheel Route: The main interaction page */}
          <Route path="/roleta" element={<Roleta />} />
          
          {/* Catch-all Route: If the URL doesn't match anything above, show a 404 page */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        
        {/* 
          Rendered outside <Routes> so it persists across all pages. 
          Allows users to toggle fullscreen mode easily on any view.
        */}
        <FullscreenButton />
      </Router>
      
      {/* 
        Toaster component must sit at the root to ensure toast notifications 
        can overlay all other content globally.
      */}
      <Toaster />
    </QueryClientProvider>
  )
}

export default App