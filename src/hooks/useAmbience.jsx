/**
 * useAmbience Hook
 * 
 * A custom React hook for managing ambient background audio using the Web Audio API.
 * It generates smooth, low-frequency pads that adapt to the current application
 * route (home or roleta) to create a cohesive atmosphere.
 * 
 * Features:
 * - Soft fade-in and fade-out for seamless transitions.
 * - Ultra-low frequencies and muted high-end to prevent intrusion.
 * - Separate sound profiles for 'home' (ethereal pads) and 'roleta' (deep pulse).
 * - Automatic cleanup of audio nodes on unmount or when components unmount.
 * - Deferred audio context creation until first user interaction (browser policy).
 * 
 * @param {('home'|'roleta')} type - The current section of the app, determining the sound profile.
 * @returns {{start: Function, stop: Function}} An object with start and stop functions to control the audio.
 */

import { useEffect, useRef, useCallback } from "react";

export function useAmbience(type = "home") {
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);

  const stop = useCallback(() => {
    nodesRef.current.forEach(node => {
      try { node.stop(); node.disconnect(); } catch (e) {}
    });
    nodesRef.current = [];
  }, []);

  const start = useCallback(() => {
    if (nodesRef.current.length > 0) return;

    try {
      // @ts-ignore - Handle webkit prefix for older Safari
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      ctxRef.current = ctx;

      const masterGain = ctx.createGain();
      const masterFilter = ctx.createBiquadFilter();
      
      masterFilter.type = "lowpass";
      masterFilter.frequency.setValueAtTime(500, ctx.currentTime); // Cut off all high-end
      masterFilter.Q.setValueAtTime(0.7, ctx.currentTime);

      masterGain.connect(masterFilter);
      masterFilter.connect(ctx.destination);
      
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 5); // Very soft fade-in

      if (type === "home") {
        // Ultra-Smooth Ethereal Pad
        const baseFreqs = [73.42, 110.00, 146.83, 220.00]; // D2, A2, D3, A3
        baseFreqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          
          osc.type = "sine"; // Only sine for maximum smoothness
          osc.frequency.setValueAtTime(f, ctx.currentTime);
          
          // Subtle detune for chorus
          osc.detune.setValueAtTime(Math.sin(i) * 5, ctx.currentTime);

          // Ultra-slow breathing
          const lfo = ctx.createOscillator();
          const lfoG = ctx.createGain();
          lfo.frequency.setValueAtTime(0.03 + i * 0.01, ctx.currentTime);
          lfoG.gain.setValueAtTime(0.02, ctx.currentTime);
          lfo.connect(lfoG);
          lfoG.connect(g.gain);

          osc.connect(g);
          g.connect(masterGain);
          
          osc.start();
          lfo.start();
          nodesRef.current.push(osc, lfo);
        });
      } else {
        // Roleta: Deep, muted calm pulse
        const baseFreq = 55; // A1
        [1, 1.5].forEach((mult, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(baseFreq * mult, ctx.currentTime);
          osc.detune.setValueAtTime(i * 3, ctx.currentTime);
          
          const lfo = ctx.createOscillator();
          const lfoG = ctx.createGain();
          lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
          lfoG.gain.setValueAtTime(0.01, ctx.currentTime);
          lfo.connect(lfoG);
          lfoG.connect(g.gain);

          osc.connect(g);
          g.connect(masterGain);
          
          osc.start();
          lfo.start();
          nodesRef.current.push(osc, lfo);
        });
      }
    } catch (e) {
      console.error("Ambience audio failed", e);
    }
  }, [type]);

  useEffect(() => {
    // We need user interaction to start audio, but we can try auto-start 
    // or wait for the first click.
    const handleFirstInteraction = () => {
      start();
      window.removeEventListener("mousedown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("mousedown", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      stop();
      window.removeEventListener("mousedown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [start, stop]);

  return { start, stop };
}
