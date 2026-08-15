/**
 * useWheelAudio Hook
 * 
 * A custom React Hook for managing all audio feedback related to the spinning wheel.
 * It uses the Web Audio API to generate high-quality, distinct sound effects for
 * different stages of the wheel interaction.
 * 
 * Features:
 * - Separate sound profiles for prize wins and losses.
 * - Distinct sounds for starting, stopping, and continuous friction during spin.
 * - "Tick" sounds as the wheel pointer passes segments.
 * - Unique audio signatures (frequency combinations) for each prize type.
 * - Automatic audio context management and cleanup.
 * 
 * @returns {{playTick: Function, playSpinStart: Function, playSpinStop: Function, playPrize: Function, playFriction: Function}} 
 *          An object containing functions to trigger each specific sound effect.
 */

import { useRef, useCallback } from "react";

// Prize sound "signatures" — each uses Web Audio API to generate a distinct tone/chord
const PRIZE_SOUNDS = {
  "Fita":           { type: "win",    freq: [880, 1100, 1320], color: "pink"   },
  "Caneta":         { type: "win",    freq: [660, 880,  990],  color: "violet" },
  "Lápis":          { type: "win",    freq: [740, 988,  1174], color: "cyan"   },
  "Saco":           { type: "win",    freq: [523, 659,  784],  color: "green"  },
  "Saca-Cápsulas":  { type: "win",    freq: [587, 784,  988],  color: "amber"  },
  "Tentar\nNovamente": { type: "lose", freq: [220, 196],         color: "red"    },
};

export function useWheelAudio() {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      // @ts-ignore - Handle webkit prefix for older Safari
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      ctxRef.current = new AudioContextClass();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  /* Tick — short click as the pointer passes a segment */
  const playTick = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (_) {}
  }, [getCtx]);

  /* Spin start — rising whoosh */
  const playSpinStart = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.75);
    } catch (_) {}
  }, [getCtx]);

  /* Continuous friction / hum while spinning */
  const playFriction = useCallback((intensity) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(120 + intensity * 400, ctx.currentTime);
      
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1000 + intensity * 2000, ctx.currentTime);
      
      gain.gain.setValueAtTime(intensity * 0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch (_) {}
  }, [getCtx]);

  /* Spin stop — descending thud */
  const playSpinStop = useCallback(() => {
    try {
      const ctx = getCtx();
      [0, 0.06, 0.12].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(300 - i * 40, ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + delay + 0.3);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.35);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.4);
      });
    } catch (_) {}
  }, [getCtx]);

  /* Prize reveal — distinct chord per prize */
  const playPrize = useCallback((prizeLabel) => {
    try {
      const ctx = getCtx();
      const sig = PRIZE_SOUNDS[prizeLabel] || PRIZE_SOUNDS["Tentar\nNovamente"];

      if (sig.type === "lose") {
        // Sad descending tones
        sig.freq.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.2);
          gain.gain.setValueAtTime(0.22, ctx.currentTime + i * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.5);
          osc.start(ctx.currentTime + i * 0.2);
          osc.stop(ctx.currentTime + i * 0.2 + 0.55);
        });
      } else {
        // Happy ascending arpeggio
        sig.freq.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
          gain.gain.setValueAtTime(0.0, ctx.currentTime + i * 0.12);
          gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + i * 0.12 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.45);
          osc.start(ctx.currentTime + i * 0.12);
          osc.stop(ctx.currentTime + i * 0.12 + 0.5);
        });
        // Bonus sparkle at the end
        setTimeout(() => {
          try {
            const o2 = ctx.createOscillator();
            const g2 = ctx.createGain();
            o2.connect(g2); g2.connect(ctx.destination);
            o2.type = "triangle";
            o2.frequency.setValueAtTime(sig.freq[sig.freq.length - 1] * 2, ctx.currentTime);
            g2.gain.setValueAtTime(0.12, ctx.currentTime);
            g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            o2.start(ctx.currentTime); o2.stop(ctx.currentTime + 0.35);
          } catch (_) {}
        }, sig.freq.length * 120 + 80);
      }
    } catch (_) {}
  }, [getCtx]);

  return { playTick, playSpinStart, playSpinStop, playPrize, playFriction };
}