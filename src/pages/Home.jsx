/**
 * Home Page (Landing / Social Gatekeeper)
 * This page serves as the entry point for the application.
 * Its primary purpose is to act as a "Social Gate" — requiring users to follow
 * specific social media accounts before they are allowed to access the Prize Wheel.
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// framer-motion is used for smooth, performant animations (springs, enter/exit transitions)
import { motion, AnimatePresence } from "framer-motion";

// lucide-react provides lightweight, customizable SVG icons
import { Gift, Sparkles, ArrowRight, Package, Zap, Globe, AlertCircle } from "lucide-react";

// Custom background component that renders an HTML Canvas fire/particle effect
import BurningBackground from "../components/BurningBackground";

// Modal component that displays the QR code for a specific social network
import SocialQRModal, { SOCIAL_CONFIG } from "../components/SocialQRModal";

// The main logo displayed at the top of the screen
const LOGO = "/icon-192.png";

// List of social networks available to follow
const SOCIALS = ["Instagram", "Facebook", "YouTube", "Website"];

/**
 * SocialIcon Component
 * Renders the appropriate SVG path/icon for a given social network name.
 * 
 * @param {Object} props
 * @param {string} props.name - The name of the social network ("Instagram", "Facebook", etc.)
 */
const SocialIcon = ({ name }) => {
  const icons = {
    Instagram: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    Facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    YouTube: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    // Fallback icon for generic website/links
    Website: <Globe className="w-5 h-5" />,
  };
  return icons[name] || null;
};

export default function Home() {
  const navigate = useNavigate();
  
  // State: Tracks which social platforms the user has successfully followed/viewed.
  // Example state: { Instagram: true, Facebook: false }
  const [followed, setFollowed] = useState({});
  
  // State: Controls which QR Modal is currently open (if any). Null means closed.
  const [openModal, setOpenModal] = useState(null);
  
  // State: Triggers the error message if the user tries to play without meeting requirements.
  const [showGateError, setShowGateError] = useState(false);

  /**
   * Called by the SocialQRModal when a user successfully "follows" an account.
   * Updates the `followed` state dictionary.
   */
  const handleFollowed = (name) => {
    setFollowed((prev) => ({ ...prev, [name]: true }));
  };

  /**
   * The Gate Logic:
   * To proceed to the wheel, the user MUST follow either Instagram OR Facebook.
   * This is a hardcoded business rule that can be adjusted as needed.
   */
  const canPlay = followed["Instagram"] || followed["Facebook"];

  /**
   * Handles the click event on the main "Play" button.
   * If the user hasn't met the criteria, it shows a temporary error message.
   * If they have, it navigates them to the `/roleta` route.
   */
  const handlePlayClick = () => {
    if (!canPlay) {
      setShowGateError(true);
      // Hide the error message automatically after 3 seconds
      setTimeout(() => setShowGateError(false), 3000);
    } else {
      navigate("/roleta");
    }
  };

  return (
    // Main wrapper: Fixed to the viewport, hidden overflow prevents scrolling bugs, deep blue background
    <div className="fixed inset-0 overflow-hidden flex flex-col" style={{ background: "#0a192f" }}>
      
      {/* Dynamic fire/sparks background rendered on an HTML Canvas */}
      <BurningBackground />

      {/* 
        Visual Overlays:
        These divs sit behind the content (z-0) but in front of the background.
        They create a complex lighting environment using radial gradients and grid patterns. 
      */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(30,64,175,0.2),_transparent_60%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(6,182,212,0.1),_transparent_50%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-grid-white opacity-[0.03] z-0 pointer-events-none" />

      {/* 
        Main Content Area:
        Flex column layout to center the UI elements. Z-index 10 brings it above the background.
      */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 overflow-hidden py-2 min-h-0">
        
        {/* Animated Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} // Starts slightly higher and invisible
          animate={{ opacity: 1, y: 0 }}   // Drops into place
          transition={{ duration: 0.7 }}
          className="mb-1 md:mb-2"
        >
          <div className="relative">
            {/* Soft glowing aura behind the logo */}
            <div className="absolute -inset-8 bg-blue-500/25 rounded-full blur-3xl" />
            <motion.img
              src={LOGO}
              alt="Event Logo"
              className="relative h-20 md:h-28 lg:h-36 w-auto drop-shadow-2xl"
              animate={{ y: [0, -6, 0] }} // Continuous bobbing animation
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              onError={(e) => { e.currentTarget.style.display = "none"; }} // Failsafe if image is missing
            />
          </div>
        </motion.div>

        {/* Animated Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }} // Delays slightly so it animates after the logo
          className="text-center mb-1 md:mb-2"
        >
          <h1 className="text-lg md:text-2xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
            Event Prize
            <br />
            {/* The word "Wheel" is styled with a cyan-to-blue gradient */}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Wheel
            </span>
          </h1>
        </motion.div>

        {/* Subtitle Badge (Glassmorphism effect) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-2 md:mb-4"
        >
          <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-sm">
            <p className="text-[11px] md:text-xs text-white/90 font-medium flex items-center gap-2">
              Bem-vindo à Feira — Tenta a tua sorte!
            </p>
          </div>
        </motion.div>

        {/* Social Follow Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mb-2 md:mb-4 w-full max-w-sm"
        >
          <p className="text-center text-white/50 text-[10px] uppercase tracking-widest mb-2 font-semibold">
            Segue-nos para jogar
          </p>
          <div className="flex items-center justify-center gap-2">
            {SOCIALS.map((name) => {
              // Retrieve configuration (colors, urls) for this specific social network
              const cfg = SOCIAL_CONFIG[name];
              const done = !!followed[name]; // Check if user has already followed it
              
              return (
                <motion.button
                  key={name}
                  onClick={() => setOpenModal(name)} // Opens the QR Modal for this network
                  whileHover={{ scale: 1.08 }} // Slight pop on mouse hover
                  whileTap={{ scale: 0.93 }}   // Squeeze effect on click
                  className="flex flex-col items-center gap-1 px-2 py-2 rounded-2xl border transition-all duration-300 relative"
                  style={{
                    // Dynamically apply brand colors if followed, otherwise keep it muted/gray
                    background: done ? cfg.bgCard : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${done ? cfg.border : "rgba(255,255,255,0.1)"}`,
                    boxShadow: done ? `0 0 16px ${cfg.glow}` : "none",
                    minWidth: 50,
                  }}
                  title={name}
                >
                  {/* Social Icon */}
                  <span className="scale-90 md:scale-100" style={{ color: done ? cfg.color : "rgba(255,255,255,0.6)" }}>
                    <SocialIcon name={name} />
                  </span>
                  {/* Social Name Label */}
                  <span className="text-[8px] md:text-[9px] font-semibold" style={{ color: done ? cfg.color : "rgba(255,255,255,0.35)" }}>
                    {name}
                  </span>
                  
                  {/* Green checkmark indicator if the task is completed */}
                  {done && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white font-bold shadow">✓</span>
                  )}
                  {/* Red exclamation indicator if the task is strictly required but NOT completed */}
                  {cfg.required && !done && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white font-bold shadow">!</span>
                  )}
                </motion.button>
              );
            })}
          </div>
          <p className="text-center text-white/25 text-[9px] mt-2">
            Instagram ou Facebook obrigatório · Website e YouTube opcionais
          </p>
        </motion.div>

        {/* Gate Error Alert (Framer Motion AnimatePresence handles mounting/unmounting animations) */}
        <AnimatePresence>
          {showGateError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-3 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center gap-2 text-red-300 text-xs font-semibold"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Segue o Instagram ou o Facebook para poderes jogar!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call-to-Action (CTA) Play Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-6"
        >
          <motion.button
            onClick={handlePlayClick}
            className="group relative px-6 py-3 rounded-2xl font-extrabold text-sm md:text-base text-white cursor-pointer overflow-hidden transition-all"
            whileHover={{ scale: canPlay ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.95 }}
            style={{
              // Button appears grayed out if `canPlay` is false, and vibrant blue/cyan if true
              background: canPlay
                ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                : "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
              boxShadow: canPlay
                ? "0 0 36px rgba(59,130,246,0.4), 0 4px 20px rgba(0,0,0,0.3)"
                : "0 4px 20px rgba(0,0,0,0.3)",
              opacity: canPlay ? 1 : 0.7,
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              <Gift className="w-4 h-4" />
              {canPlay ? "Jogar a Roleta de Brindes" : "Segue uma rede para jogar"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            
            {/* Continuous shimmer effect that passes over the button when it's active */}
            {canPlay && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.button>
        </motion.div>

        {/* Value Proposition Cards (Hidden on mobile phones to save vertical space) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="hidden sm:grid grid-cols-3 gap-2 max-w-sm w-full px-2"
        >
          {[
            { icon: <Package className="w-5 h-5 text-blue-400" />, title: "Brindes Reais", desc: "Fitas, canetas e muito mais" },
            { icon: <Gift className="w-5 h-5 text-cyan-400" />, title: "100% Grátis", desc: "Tenta a tua sorte" },
            { icon: <Zap className="w-5 h-5 text-amber-400" />, title: "Instantâneo", desc: "Descobre na hora" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 + i * 0.08 }} // Staggered animation based on index `i`
              className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center"
            >
              <div className="flex justify-center mb-1">{item.icon}</div>
              <h3 className="font-bold text-white text-xs">{item.title}</h3>
              <p className="text-white/40 text-[10px] mt-0.5">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* 
        QR Modal Component: 
        This is injected into the DOM but remains hidden until `openModal` is not null.
        It handles generating the QR code and managing the 'follow' state logic.
      */}
      <SocialQRModal
        social={openModal} // E.g., "Instagram" or null
        onClose={() => setOpenModal(null)} // Closes the modal
        onFollowed={handleFollowed} // Callback when user confirms they followed
      />
    </div>
  );
}