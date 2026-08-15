/**
 * FullscreenButton Component
 * 
 * A floating button that allows the user to toggle fullscreen mode for the app.
 * This is particularly useful for PWA installations or kiosk setups at events.
 * Listens to native browser fullscreen events to keep its state in sync.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function FullscreenButton() {
  // State to track if the browser is currently in fullscreen mode
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Handler to check the document's fullscreen element
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Listen to standard and webkit prefixed fullscreen change events
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    
    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, []);

  /**
   * Toggles the fullscreen state using browser APIs.
   * Includes fallbacks for Webkit (Safari/iOS) browsers.
   */
  const toggle = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      document.documentElement.requestFullscreen?.() ||
        document.documentElement.webkitRequestFullscreen?.();
    } else {
      // Exit fullscreen
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
  };

  return (
    <motion.button
      onClick={toggle}
      title={isFullscreen ? 'Sair do ecrã inteiro' : 'Ecrã inteiro'}
      // Positioned fixed in the top right corner over everything else (z-50)
      className="fixed top-3 right-3 z-50 w-9 h-9 flex items-center justify-center rounded-xl backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
      style={{
        background: 'rgba(10,25,47,0.6)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }} // Delays the appearance slightly on initial load
    >
      {/* Swap the icon based on current state */}
      {isFullscreen
        ? <Minimize2 className="w-4 h-4" />
        : <Maximize2 className="w-4 h-4" />
      }
    </motion.button>
  );
}
