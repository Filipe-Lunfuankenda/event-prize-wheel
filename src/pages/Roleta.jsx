/**
 * Roleta Page (Wheel of Fortune)
 * This page contains the core interactive element of the app: the spinning wheel.
 * It manages the state for triggering the spin and displaying the final result.
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// framer-motion is used for enter/exit animations and UI scaling
import { motion } from "framer-motion";

// Import UI icons from Lucide to decorate the sides of the wheel and buttons
import { ArrowLeft, Ribbon, PenLine, Pencil, ShoppingBag, Wrench, RotateCcw, Trophy } from "lucide-react";

// Components
import BurningBackground from "../components/BurningBackground"; // The animated fire background
import PrizeWheel from "../components/PrizeWheel";             // The actual physics-based wheel
import PrizeModal from "../components/PrizeModal";             // The pop-up that announces the prize

export default function Roleta() {
  const navigate = useNavigate();
  
  // State: Holds the final prize object after the wheel finishes spinning. 
  // Null means the wheel hasn't spun or finished yet.
  const [result, setResult] = useState(null);
  
  // State: A simple counter acting as a trigger.
  // Passing a changing value (like incrementing an integer) to the PrizeWheel 
  // signals it to start spinning, allowing us to control it via an external button.
  const [spinTrigger, setSpinTrigger] = useState(0);

  /**
   * Callback fired by the PrizeWheel component when the spinning animation stops.
   * @param {Object} prize - The prize object that won.
   */
  const handleResult = (prize) => {
    setResult(prize);
  };

  /**
   * Callback fired when the user closes the Prize Modal.
   * It resets the result and navigates back to the Home page (the social gate).
   * This forces the next player to pass the social gate again before playing.
   */
  const handleClose = () => {
    setResult(null);
    navigate("/"); // Redirects to the root URL
  };

  return (
    // Main container spanning the entire screen. `overflow-hidden` is crucial 
    // to prevent mobile browsers from accidentally pulling/scrolling the page.
    <div className="fixed inset-0 overflow-hidden flex flex-col" style={{ background: "#0a192f" }}>
      
      {/* 
        The BurningBackground renders behind everything (z-index wise inside its own structure), 
        providing the glowing fire particle effects. 
      */}
      <BurningBackground />

      {/* 
        Animated Gradient Overlays:
        These are large, blurred, radial gradients that sit statically on top of the dark blue
        background but behind the wheel to give the UI depth and lighting.
      */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,64,175,0.15),_transparent_60%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(6,182,212,0.1),_transparent_50%)] pointer-events-none z-0" />

      {/* 
        Top Navigation Bar (Back button & Title) 
        Positioned relative with z-10 so it sits above the gradients.
      */}
      <div className="relative z-10 px-4 mt-2 flex items-center justify-between flex-shrink-0">
        
        {/* Back Link using React Router's <Link> component to prevent full page reloads */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-[10px] font-medium backdrop-blur-sm"
        >
          <ArrowLeft className="w-3 h-3" />
          Voltar
        </Link>
        
        {/* Title container. Right-aligned. Margin prevents overlap with the global FullscreenButton */}
        <div className="text-right mr-10 md:mr-0">
          <h1 className="text-base md:text-xl font-extrabold text-white flex items-center gap-2">
            Roleta de <span className="text-cyan-400">Brindes</span>
          </h1>
        </div>
      </div>
      
      {/* 
        Main Interface Area (Wheel & Side Items)
        `flex-1` makes this section take up all remaining vertical space.
      */}
      <main className="flex-1 flex flex-col items-center justify-between px-2 relative z-10 overflow-hidden py-4">
        
        <div className="flex-1 flex items-center justify-center w-full relative">
          
          {/* 
            Left-Side Decoration: A list of possible prizes.
            These are purely visual indicators of what can be won.
            They are absolute positioned to hug the left edge.
          */}
          <div className="absolute left-2 md:left-10 flex flex-col gap-2 z-20">
            {[
              { icon: <Ribbon className="w-4 h-4 text-pink-400" />, label: "Fita" },
              { icon: <PenLine className="w-4 h-4 text-violet-400" />, label: "Caneta" },
              { icon: <Pencil className="w-4 h-4 text-cyan-400" />, label: "Lápis" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 md:p-2 rounded-full md:rounded-xl bg-white/[0.05] border border-white/10 w-10 md:w-32 backdrop-blur-md shadow-lg">
                <div className="flex-shrink-0">{p.icon}</div>
                {/* Text is hidden on small screens (w-10 ensures it remains a circle/pill) */}
                <span className="hidden md:block text-[10px] md:text-xs text-white/70 font-bold truncate">{p.label}</span>
              </div>
            ))}
          </div>

          {/* 
            The Wheel of Fortune 
            Wrapped in a framer-motion div to give it a springy "pop-in" effect when the page loads.
          */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative z-10"
          >
            {/* 
              PrizeWheel Component:
              `onResult`: Notifies us when the wheel stops.
              `hideControls`: Hides internal debug controls inside the wheel.
              `spinTrigger`: Changing this prop tells the wheel to spin programmatically.
            */}
            <PrizeWheel onResult={handleResult} hideControls={true} spinTrigger={spinTrigger} />
          </motion.div>

          {/* 
            Right-Side Decoration: More potential prizes.
            Mirrors the layout of the left side.
          */}
          <div className="absolute right-2 md:right-10 flex flex-col gap-2 z-20">
            {[
              { icon: <ShoppingBag className="w-4 h-4 text-emerald-400" />, label: "Saco" },
              { icon: <Wrench className="w-4 h-4 text-amber-400" />, label: "Saca-C." },
              { icon: <RotateCcw className="w-4 h-4 text-red-400" />, label: "Tentar" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 md:p-2 rounded-full md:rounded-xl bg-white/[0.05] border border-white/10 w-10 md:w-32 backdrop-blur-md shadow-lg">
                <div className="flex-shrink-0">{p.icon}</div>
                <span className="hidden md:block text-[10px] md:text-xs text-white/70 font-bold truncate">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 
          Bottom Group: Action Button 
          Provides a giant, unmissable button for users who don't realize they can swipe the wheel directly.
        */}
        <div className="w-full flex flex-col items-center gap-4 pb-4">
          <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-bold">
            Arrasta a roleta ou clica no botão
          </p>
          
          <motion.button
            // Clicking increments the trigger, which the <PrizeWheel> detects via useEffect
            onClick={() => setSpinTrigger(prev => prev + 1)}
            className="px-12 py-4 rounded-2xl font-black text-lg tracking-widest text-white shadow-2xl relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
              boxShadow: "0 0 40px rgba(14,165,233,0.4), inset 0 1px 0 rgba(255,255,255,0.3)"
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              <RotateCcw className="w-5 h-5" />
              Rodar a Roleta!
            </span>
            {/* Creates a continuous shine effect across the button */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.button>
        </div>
      </main>

      {/* 
        Prize Modal 
        This is conditionally rendered. If `result` is not null, the modal appears.
        When closed by the user, it calls `handleClose` which redirects them to the Home page.
      */}
      {result && <PrizeModal prize={result} onClose={handleClose} />}
    </div>
  );
}