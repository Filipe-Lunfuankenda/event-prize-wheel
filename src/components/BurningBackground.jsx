/**
 * BurningBackground Component
 * 
 * Renders an animated, highly atmospheric fire/ember background using HTML5 Canvas.
 * It features dynamic palette transitioning, radial glowing light sources, 
 * floating ember particles (sparks), and a subtle grid overlay.
 * 
 * Designed to run smoothly via requestAnimationFrame, filling the screen behind other UI layers.
 */

import React, { useEffect, useRef } from "react";

// Brand palette — defining the various color phases the background shifts between.
// These are rich, dark colors meant to serve as a high-contrast backdrop.
const PALETTE = [
  { from: "#0a192f", mid: "#1e3a8a", accent: "#3b82f6" },  // deep navy → royal blue
  { from: "#0c1a2e", mid: "#164e63", accent: "#06b6d4" },  // dark teal → cyan
  { from: "#0f0a2e", mid: "#4c1d95", accent: "#8b5cf6" },  // deep violet
  { from: "#1a0a2e", mid: "#831843", accent: "#ec4899" },  // deep magenta
  { from: "#1a0f00", mid: "#78350f", accent: "#f59e0b" },  // deep amber
  { from: "#0a1f0f", mid: "#064e3b", accent: "#10b981" },  // deep emerald
];

export default function BurningBackground() {
  const canvasRef = useRef(null);
  
  // Refs to hold mutable state without triggering React re-renders,
  // which is crucial for 60fps canvas performance.
  const frameRef  = useRef(null);
  const tRef      = useRef(0); // Global time parameter for sine waves (pulsing/swaying)
  const palRef    = useRef(0); // Current palette index
  const nextPalRef = useRef(1); // Next palette index to transition to
  const transRef  = useRef(0); // Transition progress from current to next palette (0..1)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Resize handler to ensure the canvas always covers the full viewport window
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize the ember / spark particles array
    // Creates 70 individual sparks with random starting properties.
    const sparks = Array.from({ length: 70 }, () => newSpark(canvas));

    /**
     * Generates a new spark object starting at the bottom of the screen.
     */
    function newSpark(c) {
      return {
        x: Math.random() * c.width, // Random horizontal position
        y: c.height + Math.random() * 40, // Start slightly below the visible screen
        size: Math.random() * 3 + 0.5,
        speed: Math.random() * 0.8 + 0.3, // Upward velocity
        drift: (Math.random() - 0.5) * 0.6, // Horizontal drift
        life: 1, // Opacity multiplier (decays over time)
        decay: Math.random() * 0.003 + 0.001, // How fast the spark fades and dies
        hue: Math.random() * 60 + 10, // Base hue in the orange–yellow range
      };
    }

    /**
     * Linearly interpolates (lerps) between two hex color strings.
     * Essential for the smooth transition between the different palettes.
     */
    function lerpColor(c1, c2, t) {
      const parse = (hex) => {
        const n = parseInt(hex.replace("#",""), 16);
        return [(n>>16)&255, (n>>8)&255, n&255];
      };
      const a = parse(c1), b = parse(c2);
      return `rgb(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)})`;
    }

    // Configuration for the palette transition logic
    const TRANSITION_SPEED = 0.0015; // How fast the palette transitions per frame
    const HOLD_TIME = 300; // Number of frames to hold a color before starting the next transition
    let holdCounter = 0;
    let transitioning = false;

    /**
     * Main animation loop.
     * Clears the canvas, updates state, and redraws all elements every frame.
     */
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      
      // Increment time
      tRef.current += 0.012;
      const t = tRef.current;

      // ── Palette Cycle Logic ──
      if (!transitioning) {
        holdCounter++;
        if (holdCounter > HOLD_TIME) {
          // Time to start transitioning to the next color
          holdCounter = 0;
          transitioning = true;
          transRef.current = 0;
          nextPalRef.current = (palRef.current + 1) % PALETTE.length;
        }
      } else {
        // Increment transition progress
        transRef.current += TRANSITION_SPEED;
        if (transRef.current >= 1) {
          // Transition finished, lock in the new color
          transRef.current = 1;
          palRef.current   = nextPalRef.current;
          transitioning    = false;
        }
      }

      // Calculate the exact current colors by lerping between current and next palettes
      const p  = PALETTE[palRef.current];
      const pN = PALETTE[nextPalRef.current];
      const tr = transRef.current;

      const bg     = lerpColor(p.from,   pN.from,   tr);
      const midC   = lerpColor(p.mid,    pN.mid,    tr);
      const accentC = lerpColor(p.accent, pN.accent, tr);

      // ── Rendering Layers ──

      // 1. Base fill (deepest background color)
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // 2. Burning radial gradient from the bottom center (simulates the fire base)
      const fireGrad = ctx.createRadialGradient(W/2, H * 1.1, 0, W/2, H * 0.6, H * 0.85);
      fireGrad.addColorStop(0,   accentC.replace(")",",0.25)").replace("rgb","rgba"));
      fireGrad.addColorStop(0.4, midC.replace(")",",0.14)").replace("rgb","rgba"));
      fireGrad.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = fireGrad;
      ctx.fillRect(0, 0, W, H);

      // 3. Pulsing top radial gradient (aurora-like effect that breathes)
      const pulseA = 0.08 + 0.04 * Math.sin(t * 0.7); // Oscillates alpha
      const topGrad = ctx.createRadialGradient(W/2, H * 0.2, 0, W/2, H * 0.5, W * 0.7);
      topGrad.addColorStop(0,   accentC.replace(")",`,${pulseA})`).replace("rgb","rgba"));
      topGrad.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, W, H);

      // 4. Side vignette glows to frame the center
      const leftGrad = ctx.createRadialGradient(0, H*0.7, 0, W*0.3, H*0.5, W*0.4);
      leftGrad.addColorStop(0,   midC.replace(")",",0.08)").replace("rgb","rgba"));
      leftGrad.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = leftGrad; 
      ctx.fillRect(0, 0, W, H);

      const rightGrad = ctx.createRadialGradient(W, H*0.7, 0, W*0.7, H*0.5, W*0.4);
      rightGrad.addColorStop(0,   midC.replace(")",",0.08)").replace("rgb","rgba"));
      rightGrad.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = rightGrad; 
      ctx.fillRect(0, 0, W, H);

      // 5. Floating ember sparks system
      sparks.forEach((s, idx) => {
        // Move spark upwards and apply horizontal sway based on a sine wave
        s.y     -= s.speed;
        s.x     += s.drift + Math.sin(t * 0.5 + idx) * 0.3;
        s.life  -= s.decay;

        // If spark is dead or off-screen, recycle it at the bottom
        if (s.life <= 0 || s.y < -10) {
          sparks[idx] = newSpark(canvas);
          return;
        }

        const alpha = s.life * 0.75;
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Draw the glowing spark
        const sparkGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2);
        // Spark core matches the current accent color
        sparkGrad.addColorStop(0, accentC.replace(")",",1)").replace("rgb","rgba"));
        sparkGrad.addColorStop(0.5, `hsla(${s.hue},100%,70%,0.6)`);
        sparkGrad.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = sparkGrad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 6. Cybernetic grid overlay (very subtle, helps give depth to the background)
      ctx.save();
      ctx.globalAlpha = 0.03;
      ctx.strokeStyle = accentC;
      ctx.lineWidth = 0.5;
      const gs = 40; // Grid square size
      for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      ctx.restore();

      // Request next frame
      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    // Cleanup function when component unmounts
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full block z-0 pointer-events-none object-cover"
    />
  );
}