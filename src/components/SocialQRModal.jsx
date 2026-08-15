/**
 * SocialQRModal Component
 * 
 * Displays a popup modal with a QR Code for a selected social network.
 * Used on the gatekeeper/home screen so users can quickly follow/subscribe
 * via their smartphones. Includes visual configurations (colors, icons) for
 * each social platform.
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react"; // Renders crisp SVG QR codes
import { X, Globe } from "lucide-react";

/**
 * SOCIAL_CONFIG mapping.
 * Defines the styling, URL, icon, and requirements for each network.
 */
const SOCIAL_CONFIG = {
  Instagram: {
    url: "https://www.instagram.com/eventprizewheel/",
    color: "#E1306C",
    bg: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)", // Classic Insta gradient
    bgCard: "rgba(225,48,108,0.12)",
    border: "rgba(225,48,108,0.5)",
    glow: "rgba(225,48,108,0.4)",
    fgColor: "#E1306C", // Used for the dark parts of the QR code
    label: "@eventprizewheel",
    required: true,     // User must click "followed" on this or FB to play
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  Facebook: {
    url: "https://www.facebook.com/eventprizewheel",
    color: "#1877F2",
    bg: "linear-gradient(135deg, #1877F2, #0a4cad)",
    bgCard: "rgba(24,119,242,0.12)",
    border: "rgba(24,119,242,0.5)",
    glow: "rgba(24,119,242,0.4)",
    fgColor: "#1877F2",
    label: "eventprizewheel",
    required: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  YouTube: {
    url: "https://www.youtube.com/@EventPrizeWheel",
    color: "#FF0000",
    bg: "linear-gradient(135deg, #FF0000, #cc0000)",
    bgCard: "rgba(255,0,0,0.10)",
    border: "rgba(255,0,0,0.4)",
    glow: "rgba(255,0,0,0.35)",
    fgColor: "#CC0000",
    label: "@EventPrizeWheel",
    required: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  Website: {
    url: "https://example.com/",
    color: "#3b82f6",
    bg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    bgCard: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.5)",
    glow: "rgba(59,130,246,0.4)",
    fgColor: "#1d4ed8",
    label: "example.com",
    required: false,
    icon: <Globe className="w-7 h-7" />,
  },
};

export default function SocialQRModal({ social, onClose, onFollowed }) {
  if (!social) return null;
  const cfg = SOCIAL_CONFIG[social];
  if (!cfg) return null;

  /**
   * Called when the user clicks the "I already followed" button.
   * Tells the parent (Home.jsx) to update the state and close the modal.
   */
  const handleFollowed = () => {
    onFollowed(social);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Dark overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 18, stiffness: 250 }}
          className="relative z-10 w-full max-w-xs"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing it
        >
          <div
            className="rounded-3xl p-6 text-center relative overflow-hidden"
            style={{
              background: "rgba(8,18,38,0.97)",
              border: `1.5px solid ${cfg.border}`,
              boxShadow: `0 0 50px ${cfg.glow}, 0 0 100px ${cfg.glow}`,
            }}
          >
            {/* Top color accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{ background: cfg.bg }}
            />

            {/* Close X Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon + Network Name header */}
            <div className="flex flex-col items-center gap-2 mb-4 mt-1">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: cfg.bg, boxShadow: `0 4px 20px ${cfg.glow}` }}
              >
                <span style={{ color: "#fff" }}>{cfg.icon}</span>
              </div>
              <div>
                <h3 className="text-white font-extrabold text-lg">{social}</h3>
                {cfg.required && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: cfg.bgCard, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                    Obrigatório
                  </span>
                )}
                {!cfg.required && (
                  <span className="text-xs text-white/40">Opcional</span>
                )}
              </div>
            </div>

            {/* QR Code Canvas/SVG */}
            <div
              className="mx-auto mb-4 rounded-2xl p-3 inline-block"
              style={{ background: "#fff", boxShadow: `0 0 24px ${cfg.glow}` }}
            >
              <QRCodeSVG
                value={cfg.url}
                size={170}
                fgColor={cfg.fgColor}
                bgColor="#ffffff"
                level="M"
                imageSettings={{
                  src: "",
                  height: 0,
                  width: 0,
                  excavate: false,
                }}
              />
            </div>

            {/* URL string underneath */}
            <p className="text-white/30 text-xs mb-5 break-all px-2">{cfg.url}</p>

            {/* Call to Action Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleFollowed}
              className="w-full py-3 rounded-2xl font-bold text-white text-base"
              style={{ background: cfg.bg, boxShadow: `0 4px 20px ${cfg.glow}` }}
            >
              ✓ Já segui / visitei!
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export { SOCIAL_CONFIG };