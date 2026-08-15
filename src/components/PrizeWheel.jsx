/**
 * PrizeWheel Component
 * 
 * This is the core interactive component of the application. It renders a 3D-styled, 
 * physics-based spinning wheel using an HTML5 <canvas>.
 * 
 * Features:
 * - Custom drawing logic for segments, gradients, shadows, and icons without external image assets.
 * - Physics simulation (velocity, friction) allowing the user to swipe/drag to spin.
 * - Integration with Framer Motion for 3D parallax effects (tilting based on mouse position).
 * - Audio hooks integration for tick, friction, and win sounds.
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, Loader2 } from "lucide-react";
import { useWheelAudio } from "../hooks/useWheelAudio";
import { getRandomPrizeWeighted } from "@/lib/prizeLogic"; // Custom logic to determine the prize based on configured weights

// Define the available prizes. Colors are used for the canvas gradients.
const PRIZES = [
  { label: "Fita",            color: "#ec4899", darkColor: "#9d174d", lightColor: "#fbcfe8", icon: "ribbon"  },
  { label: "Caneta",          color: "#8b5cf6", darkColor: "#4c1d95", lightColor: "#ddd6fe", icon: "pen"     },
  { label: "Lápis",           color: "#06b6d4", darkColor: "#164e63", lightColor: "#a5f3fc", icon: "pencil"  },
  { label: "Saco",            color: "#10b981", darkColor: "#064e3b", lightColor: "#a7f3d0", icon: "bag"     },
  { label: "Saca-Cápsulas",   color: "#f59e0b", darkColor: "#78350f", lightColor: "#fde68a", icon: "wrench"  },
  { label: "Sem Prémio",      color: "#ef4444", darkColor: "#7f1d1d", lightColor: "#fecaca", icon: "retry" },
];

const NUM = PRIZES.length; // Total number of segments
const SEG = (Math.PI * 2) / NUM; // Angle size of each segment in radians

/**
 * Draws the entire wheel on the provided CanvasRenderingContext2D.
 * Called on every frame during a spin to update rotation and highlighted segments.
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
 * @param {number} size - The width/height of the square canvas.
 * @param {number} rotationRad - The current rotation of the wheel in radians.
 * @param {number} highlightSegment - The index of the segment currently at the top (under the pointer).
 */
function drawWheel(ctx, size, rotationRad, highlightSegment) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = cx - 10;
  const innerR = outerR * 0.13; // Radius of the center hub

  ctx.clearRect(0, 0, size, size);

  /* ── Drop shadow beneath the entire wheel ── */
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.restore();

  /* ── Outer Rim / Bezel ── */
  const rimGrad = ctx.createLinearGradient(0, 0, size, size);
  rimGrad.addColorStop(0,   "rgba(255,255,255,0.45)");
  rimGrad.addColorStop(0.5, "rgba(120,130,160,0.3)");
  rimGrad.addColorStop(1,   "rgba(30,40,70,0.8)");
  ctx.beginPath();
  ctx.arc(cx, cy, outerR + 7, 0, Math.PI * 2);
  ctx.fillStyle = rimGrad;
  ctx.fill();

  /* ── Draw Individual Segments ── */
  PRIZES.forEach((prize, i) => {
    // Calculate the start, end, and middle angles for this specific segment based on current global rotation
    const startA = rotationRad + i * SEG;
    const endA   = rotationRad + (i + 1) * SEG;
    const midA   = startA + SEG / 2;
    const isHL   = highlightSegment === i; // True if this segment is currently ticking under the pointer

    ctx.save();

    /* 1. Base segment fill – Rich radial gradient */
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, startA, endA);
    ctx.closePath();

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
    grad.addColorStop(0,    prize.lightColor + "cc");
    grad.addColorStop(0.35, prize.color);
    grad.addColorStop(0.7,  prize.color);
    grad.addColorStop(1,    prize.darkColor);
    ctx.fillStyle = grad;
    ctx.fill();

    /* 2. Lighter wedge highlight (top-left) to simulate a 3D bevel/shine */
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, startA, endA);
    ctx.closePath();
    const shine = ctx.createLinearGradient(
      cx + Math.cos(midA - Math.PI) * outerR * 0.5,
      cy + Math.sin(midA - Math.PI) * outerR * 0.5,
      cx + Math.cos(midA) * outerR * 0.8,
      cy + Math.sin(midA) * outerR * 0.8
    );
    shine.addColorStop(0, "rgba(255,255,255,0.22)");
    shine.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shine;
    ctx.fill();

    /* 3. Highlighted segment effect (Triggers when the segment is under the top pointer) */
    if (isHL) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, startA, endA);
      ctx.closePath();
      
      // Multi-layered glow
      const hlGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
      hlGrad.addColorStop(0, "rgba(255,255,255,0.45)");
      hlGrad.addColorStop(0.6, "rgba(255,255,255,0.15)");
      hlGrad.addColorStop(1, "rgba(255,255,255,0.05)");
      ctx.fillStyle = hlGrad;
      ctx.fill();

      // Outer rim flare specific to the active segment
      ctx.beginPath();
      ctx.arc(cx, cy, outerR + 3, startA, endA);
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 5;
      ctx.stroke();

      // Inner stroke highlight on the leading and trailing edges
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(startA) * outerR, cy + Math.sin(startA) * outerR);
      ctx.lineTo(cx + Math.cos(endA) * outerR, cy + Math.sin(endA) * outerR);
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    /* 4. Divider lines between all segments */
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(startA) * outerR, cy + Math.sin(startA) * outerR);
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth   = 2;
    ctx.stroke();

    /* ── Content: Icon + Label inside the segment ── */
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(midA); // Rotate canvas so text/icon can be drawn "upright" relative to the segment middle

    // Layout constants — icon near rim, label closer to center, with clear gap
    const iconDist  = outerR * 0.78;   
    const textDist  = outerR * 0.48;   
    const iconSize  = Math.max(14, Math.floor(size / 16));
    const fontSize  = Math.max(10, Math.floor(size / 32));

    /* Icon drawing */
    ctx.save();
    ctx.translate(iconDist, 0);
    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.fillStyle   = "rgba(255,255,255,0.95)";
    ctx.lineWidth   = Math.max(1.8, iconSize / 7);
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur  = 4;
    drawPrizeIcon(ctx, prize.icon, 0, 0, iconSize);
    ctx.restore();

    /* Subtle separator line between icon and text */
    ctx.save();
    ctx.beginPath();
    const sepDist = outerR * 0.63;
    ctx.moveTo(sepDist, -iconSize * 0.55);
    ctx.lineTo(sepDist,  iconSize * 0.55);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    /* Label text drawing */
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur  = 5;
    ctx.font        = `bold ${fontSize}px Inter, sans-serif`;
    ctx.fillStyle   = "#ffffff";
    ctx.textAlign   = "center";
    ctx.textBaseline = "middle";

    // Handle multiline labels if they contain \n
    const lines = prize.label.split("\n");
    const lineH = fontSize * 1.4;
    lines.forEach((line, li) => {
      const yOff = (li - (lines.length - 1) / 2) * lineH;
      ctx.fillText(line, textDist, yOff);
    });
    ctx.shadowBlur = 0;

    ctx.restore(); // Restore from content rotation
    ctx.restore(); // Restore from segment transformations
  });

  /* ── Outer glowing ring (Neon effect) ── */
  ctx.save();
  ctx.shadowColor = "rgba(96,165,250,0.55)";
  ctx.shadowBlur  = 18;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR + 1, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(96,165,250,0.5)";
  ctx.lineWidth   = 3.5;
  ctx.stroke();
  ctx.restore();

  /* ── Tick marks on the rim (Decorative) ── */
  const ticks = NUM * 3;
  for (let i = 0; i < ticks; i++) {
    const a       = (i / ticks) * Math.PI * 2;
    const major   = i % 3 === 0;
    const inner   = outerR - (major ? 10 : 5);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * inner,    cy + Math.sin(a) * inner);
    ctx.lineTo(cx + Math.cos(a) * (outerR+2), cy + Math.sin(a) * (outerR+2));
    ctx.strokeStyle = major ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)";
    ctx.lineWidth   = major ? 2 : 1;
    ctx.stroke();
  }

  /* ── Center Hub (The metal bolt in the middle) ── */
  const hubGrad = ctx.createRadialGradient(cx - innerR*0.3, cy - innerR*0.3, 0, cx, cy, innerR * 1.2);
  hubGrad.addColorStop(0,   "#93c5fd");
  hubGrad.addColorStop(0.5, "#3b82f6");
  hubGrad.addColorStop(1,   "#1e3a8a");
  ctx.save();
  ctx.shadowColor = "rgba(59,130,246,0.6)";
  ctx.shadowBlur  = 15;
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = hubGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth   = 2.5;
  ctx.stroke();
  ctx.restore();

  // Hub shine overlay
  ctx.beginPath();
  ctx.arc(cx - innerR * 0.25, cy - innerR * 0.25, innerR * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fill();
}

/**
 * Helper function to draw vector icons on the canvas using primitive path shapes.
 * This avoids needing to load external images, ensuring the wheel renders instantly.
 */
function drawPrizeIcon(ctx, icon, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  const h = s * 0.9;
  switch (icon) {
    case "ribbon":
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-h*0.5, -h*0.9, -h*1.1, -h*0.1, 0, h*0.3);
      ctx.bezierCurveTo(h*1.1, -h*0.1, h*0.5, -h*0.9, 0, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-h*0.5, h*0.4,  -h*1.0, h*1.0, 0, h*0.9);
      ctx.bezierCurveTo( h*1.0, h*1.0,  h*0.5,  h*0.4, 0, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, h*0.14, 0, Math.PI*2);
      ctx.fill();
      break;
    case "pen":
      ctx.beginPath();
      ctx.roundRect(-h*0.18, -h*1.0, h*0.36, h*1.6, h*0.08);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-h*0.18, h*0.6);
      ctx.lineTo(0, h*1.0);
      ctx.lineTo(h*0.18, h*0.6);
      ctx.fill();
      ctx.fillRect(-h*0.18, -h*1.0, h*0.36, h*0.28);
      break;
    case "pencil":
      ctx.beginPath();
      ctx.roundRect(-h*0.14, -h*0.95, h*0.28, h*1.6, h*0.06);
      ctx.stroke();
      ctx.fillRect(-h*0.14, -h*0.95, h*0.28, h*0.26);
      ctx.beginPath();
      ctx.moveTo(-h*0.14, h*0.65);
      ctx.lineTo(0, h*1.05);
      ctx.lineTo(h*0.14, h*0.65);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-h*0.14, h*0.65);
      ctx.lineTo(h*0.14, h*0.65);
      ctx.stroke();
      break;
    case "bag":
      ctx.beginPath();
      ctx.roundRect(-h*0.65, -h*0.3, h*1.3, h*1.3, h*0.12);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -h*0.3, h*0.38, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-h*0.2, h*0.15);
      ctx.lineTo(h*0.2, h*0.15);
      ctx.stroke();
      break;
    case "wrench": {
      const wr = h * 0.42;
      ctx.beginPath();
      ctx.arc(-h*0.25, -h*0.55, wr, 0, Math.PI*2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-h*0.25, -h*0.55, wr*0.38, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-h*0.05, -h*0.2);
      ctx.lineTo(h*0.55, h*0.9);
      ctx.lineWidth = Math.max(2, s/5);
      ctx.stroke();
      break;
    }
    case "retry":
      ctx.beginPath();
      ctx.arc(0, h*0.05, h*0.7, Math.PI*0.15, Math.PI*1.85);
      ctx.stroke();
      // top arrow head for the retry circular arrow
      const a1x = Math.cos(Math.PI*0.15)*h*0.7, a1y = Math.sin(Math.PI*0.15)*h*0.7 + h*0.05;
      ctx.beginPath();
      ctx.moveTo(a1x, a1y);
      ctx.lineTo(a1x - h*0.28, a1y - h*0.08);
      ctx.lineTo(a1x + h*0.08, a1y - h*0.28);
      ctx.closePath();
      ctx.fill();
      break;
    default:
      // Fallback dot
      ctx.beginPath();
      ctx.arc(0, 0, h*0.55, 0, Math.PI*2);
      ctx.fill();
  }
  ctx.restore();
}

/* ─── Color Utility Functions (Currently unused but kept for potential dynamic theming) ─── */
function lightenColor(hex, pct) {
  const n = parseInt(hex.replace("#",""),16);
  return `rgb(${Math.min(255,(n>>16)+Math.round(2.55*pct))},${Math.min(255,((n>>8)&255)+Math.round(2.55*pct))},${Math.min(255,(n&255)+Math.round(2.55*pct))})`;
}
function darkenColor(hex, pct) {
  const n = parseInt(hex.replace("#",""),16);
  return `rgb(${Math.max(0,(n>>16)-Math.round(2.55*pct))},${Math.max(0,((n>>8)&255)-Math.round(2.55*pct))},${Math.max(0,(n&255)-Math.round(2.55*pct))})`;
}

/* ─── Easing Functions ─── */
// Used to make the wheel spin slow down naturally like physical friction
function easeOutQuintic(t) { return 1 - Math.pow(1 - t, 5); }

/* ─── Main Component ─── */
export default function PrizeWheel({ onResult, hideControls = false, spinTrigger = null }) {
  // DOM Refs
  const canvasRef     = useRef(null);
  const wrapRef       = useRef(null);

  // State
  const [spinning, setSpinning]         = useState(false);
  const [rotation, setRotation]         = useState(0);          // Current rotation in radians
  const [highlightSeg, setHighlightSeg] = useState(-1);         // Index of segment currently passing the top pointer
  const [blur, setBlur]                 = useState(0);          // Used for radial motion blur effect
  const [tilt, setTilt]                 = useState({ x: 0, y: 0 }); // 3D Parallax tilt
  const [pointerRotation, setPointerRotation] = useState(0);    // Animates the physical top pointer "ticking"

  // Mutable refs (to avoid stale closures inside requestAnimationFrame loops)
  const rotRef        = useRef(0);
  const animRef       = useRef(null);
  const spinningRef   = useRef(false);
  const lastTickSeg   = useRef(-1);

  // Audio Hooks
  const { playTick, playSpinStart, playSpinStop, playPrize, playFriction } = useWheelAudio();

  // Drag/Swipe Physics State
  const dragging      = useRef(false);
  const lastAngle     = useRef(0);
  const lastTime      = useRef(0);
  const velocity      = useRef(0);   // speed in rad/ms
  const lastDragRot   = useRef(0);

  /**
   * Calculates the appropriate canvas size based on the viewport width and height.
   * Ensures the wheel is always visible and doesn't overflow vertically.
   */
  const getCanvasSize = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // Base size on width
    let size = 480;
    if (w < 400) size = 310;
    else if (w < 600) size = 350;
    else if (w < 900) size = 400;

    // Constrain by height to ensure it fits with header/footer/title/prizelist
    const maxHeight = h * 0.50; // Max 50% of screen height
    return Math.min(size, maxHeight);
  }, []);
  const [canvasSize, setCanvasSize] = useState(getCanvasSize());

  // Handle window resize
  useEffect(() => {
    const hr = () => setCanvasSize(getCanvasSize());
    window.addEventListener("resize", hr);
    return () => window.removeEventListener("resize", hr);
  }, [getCanvasSize]);

  /**
   * Redraw the canvas whenever rotation, size, or highlight segment changes.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1; // Support for high-DPI (Retina) displays
    canvas.width  = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    ctx.scale(dpr, dpr);
    drawWheel(ctx, canvasSize, rotation, highlightSeg);
  }, [canvasSize, rotation, highlightSeg]);

  /**
   * Calculates which segment index is currently positioned at the very top (under the arrow).
   */
  const getSegmentAtTop = useCallback((rot) => {
    // Math.PI/2 offset because 0 radians is typically right/3 o'clock, but we want top/12 o'clock
    const norm = (((-rot - Math.PI/2) % (Math.PI*2)) + Math.PI*2) % (Math.PI*2);
    return Math.floor(norm / SEG) % NUM;
  }, []);

  /**
   * Core logic for animating the wheel spin to a specific determined prize.
   * 
   * @param {number} startRot - The current rotation before spin starts.
   * @param {number} startVel - Any initial velocity from a user swipe/drag.
   */
  const spinToTarget = useCallback((startRot, startVel = 0) => {
    if (spinningRef.current) return;
    spinningRef.current = true;
    setSpinning(true);

    // Request our weighted outcome from the prize logic engine
    const { prize: selectedPrize, index: randomIdx } = getRandomPrizeWeighted(PRIZES);

    // Calculate the exact angle we need the wheel to stop at for the selected prize
    const targetAngle = -(randomIdx * SEG + SEG / 2 + Math.PI / 2);
    
    // Scale extra laps based on how hard the user swiped (for realism)
    const velocityFactor = Math.abs(startVel) * 12;
    const extraLaps   = (6 + Math.floor(Math.random() * 4) + Math.floor(velocityFactor)) * Math.PI * 2;
    
    // Calculate total rotation distance
    const target      = startRot - ((startRot - targetAngle) % (Math.PI*2)) - extraLaps;
    const totalDelta  = target - startRot;
    
    // Duration also scales with swipe speed
    const baseDur     = 5800 + Math.random() * 1200;
    const duration    = Math.max(3500, baseDur + Math.abs(startVel) * 1000);

    const start = performance.now();

    // The animation loop function (called via requestAnimationFrame)
    const animate = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuintic(progress); // apply friction easing
      const cur      = startRot + totalDelta * eased;

      rotRef.current = cur;
      setRotation(cur);
      const seg = getSegmentAtTop(cur);
      setHighlightSeg(seg);

      // Audio & Haptic feedback triggering when crossing a segment boundary
      const speed = 1 - progress;
      if (seg !== lastTickSeg.current) {
        lastTickSeg.current = seg;
        playTick();
        
        // Make the physical top pointer visually snap/tick
        setPointerRotation(-20); 
        setTimeout(() => setPointerRotation(0), 50);
        
        // Haptic vibration for mobile devices
        if (navigator.vibrate) navigator.vibrate(5);
      }
      
      // Play a continuous sliding friction sound while moving fast enough
      if (elapsed % 100 < 16) {
        playFriction(speed);
      }

      // Motion Blur intensity calculation
      setBlur(speed * 4); 
      
      if (progress < 1) {
        // Keep animating
        animRef.current = requestAnimationFrame(animate);
      } else {
        // Animation finished
        spinningRef.current = false;
        setSpinning(false);
        setHighlightSeg(-1);
        setBlur(0);
        lastTickSeg.current = -1;
        playSpinStop();
        
        // Small delay before announcing the prize for dramatic effect
        setTimeout(() => playPrize(PRIZES[randomIdx].label), 400);
        
        // Callback to parent component
        onResult(PRIZES[randomIdx]);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [getSegmentAtTop, onResult]);

  /**
   * Triggered when user clicks the "Spin" button instead of swiping.
   */
  const handleSpinButton = () => {
    if (spinningRef.current) return;
    cancelAnimationFrame(animRef.current);
    playSpinStart();
    spinToTarget(rotRef.current, 0);
  };

  /**
   * External trigger support. 
   * If the parent passes a changed `spinTrigger` value (e.g. an incrementing integer),
   * we start the spin programmatically.
   */
  useEffect(() => {
    if (spinTrigger && !spinningRef.current) {
      handleSpinButton();
    }
  }, [spinTrigger]);

  /* ── Drag / touch physics helpers ── */
  
  // Gets the absolute angle of the user's cursor/finger relative to the wheel center
  const getAngleFromCenter = useCallback((clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx);
  }, []);

  const onDragStart = useCallback((clientX, clientY) => {
    if (spinningRef.current) return;
    cancelAnimationFrame(animRef.current);
    dragging.current    = true;
    lastAngle.current   = getAngleFromCenter(clientX, clientY);
    lastTime.current    = performance.now();
    lastDragRot.current = rotRef.current;
    velocity.current    = 0;
  }, [getAngleFromCenter]);

  const onDragMove = useCallback((clientX, clientY) => {
    if (!dragging.current) return;
    const now    = performance.now();
    const angle  = getAngleFromCenter(clientX, clientY);
    const delta  = angle - lastAngle.current;
    const dt     = now - lastTime.current;

    // Handle wrap-around where atan2 jumps from PI to -PI
    let d = delta;
    if (d >  Math.PI) d -= Math.PI*2;
    if (d < -Math.PI) d += Math.PI*2;

    rotRef.current += d;
    velocity.current = dt > 0 ? d / dt : 0; // Calculate speed
    lastAngle.current = angle;
    lastTime.current  = now;

    const r = rotRef.current;
    setRotation(r);
    
    // Play ticks while manually dragging
    const seg = getSegmentAtTop(r);
    if (seg !== lastTickSeg.current) {
      lastTickSeg.current = seg;
      playTick();
      setPointerRotation(-15);
      setTimeout(() => setPointerRotation(0), 40);
    }
    setHighlightSeg(seg);
    setBlur(Math.abs(velocity.current) * 150); // Small blur when dragging manually
  }, [getAngleFromCenter, getSegmentAtTop]);

  const onDragEnd = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    const vel = velocity.current;
    
    // Only launch the full spin sequence if the user dragged with enough velocity
    if (Math.abs(vel) > 0.001) {
      playSpinStart();
      spinToTarget(rotRef.current, vel);
    } else {
      // Otherwise, just drop the wheel where it is
      setHighlightSeg(-1);
      setBlur(0);
    }
  }, [spinToTarget, playSpinStart]);

  /* ── Mouse Events Setup ── */
  useEffect(() => {
    const onMouseMove = (e) => onDragMove(e.clientX, e.clientY);
    const onMouseUp   = ()  => onDragEnd();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
    };
  }, [onDragMove, onDragEnd]);

  /* ── Touch Events Handlers ── */
  const onTouchStart = (e) => {
    const t = e.touches[0];
    onDragStart(t.clientX, t.clientY);
  };
  const onTouchMove = (e) => {
    // Prevent scrolling the page while interacting with the wheel
    if(e.cancelable) e.preventDefault(); 
    const t = e.touches[0];
    onDragMove(t.clientX, t.clientY);
  };
  const onTouchEnd = () => onDragEnd();

  /* ── 3D Parallax Mouse Tracking ── */
  // Tilts the whole wheel wrapper slightly towards the user's mouse cursor
  const handleMouseMove = (e) => {
    if (spinningRef.current) return;
    const { clientX, clientY } = e;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const x = (clientX - w / 2) / (w / 2); // -1 to 1
    const y = (clientY - h / 2) / (h / 2); // -1 to 1
    setTilt({ x: x * 15, y: y * -15 });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* ── 3D wheel wrapper container ── */}
      <div
        ref={wrapRef}
        className="relative select-none"
        style={{ perspective: "1100px" }} // CSS perspective for the 3D tilt effects
      >
        {/* Ambient glow beneath the wheel, reacts to spinning speed (blur) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(96,165,250,${0.3 + blur * 0.1}) 0%, transparent 72%)`,
            transform: `scale(${1.35 + blur * 0.05}) translateY(10%)`,
            filter: `blur(${28 + blur * 2}px)`,
          }}
        />

        {/* The physical pointer / arrow fixed at the top */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-40 pointer-events-none"
          style={{ top: -12, originY: "10%" }}
          animate={{ 
            rotate: pointerRotation, // Driven by the tick state above
            scale: spinning ? [1, 1.1, 1] : 1
          }}
          transition={{ 
            rotate: { type: "spring", stiffness: 400, damping: 15 },
            scale: { duration: 0.2, repeat: spinning ? Infinity : 0 }
          }}
        >
          {/* SVG representation of the golden arrow */}
          <svg width="46" height="58" viewBox="0 0 46 58" className="drop-shadow-xl">
            <defs>
              <linearGradient id="ptrG" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#fef08a" />
                <stop offset="50%"  stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <filter id="ptrShadow">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.45"/>
              </filter>
            </defs>
            <polygon
              points="23,58 5,12 23,22 41,12"
              fill="url(#ptrG)"
              stroke="#fef3c7"
              strokeWidth="1.5"
              filter="url(#ptrShadow)"
            />
            <circle cx="23" cy="11" r="9"  fill="#fbbf24" stroke="#fef3c7" strokeWidth="2" filter="url(#ptrShadow)"/>
            <circle cx="23" cy="11" r="4"  fill="#fef9c3" />
            <circle cx="21" cy="9"  r="1.5" fill="white" opacity="0.7"/>
          </svg>
        </motion.div>

        {/* Canvas Element — Handles the 3D tilt and applies the actual rendering */}
        <motion.div
          style={{ 
            transformStyle: "preserve-3d",
            rotateY: tilt.x,
            rotateX: tilt.y
          }}
          // Exaggerate the 3D movement slightly when spinning
          animate={spinning ? { 
            rotateX: [tilt.y, tilt.y + 4, tilt.y - 3, tilt.y + 1, tilt.y],
            scale: [1, 1.015, 0.995, 1],
            z: [0, 20, -10, 0]
          } : { 
            rotateX: tilt.y,
            rotateY: tilt.x,
            z: 0 
          }}
          transition={{ 
            duration: 2, 
            repeat: spinning ? Infinity : 0, 
            ease: "easeInOut",
            rotateY: { type: "spring", stiffness: 40, damping: 20 },
            rotateX: { type: "spring", stiffness: 40, damping: 20 }
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: canvasSize,
              height: canvasSize,
              cursor: spinning ? "not-allowed" : (dragging.current ? "grabbing" : "grab"),
              borderRadius: "50%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 4px 16px rgba(59,130,246,0.25), inset 0 -4px 12px rgba(0,0,0,0.3)",
              filter: `blur(${blur}px)`, // Applies CSS blur for motion effect on top of internal canvas rendering
              transition: "filter 0.1s ease-out"
            }}
            onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        </motion.div>

        {/* Spinning ring halo effect (only visible while spinning) */}
        <AnimatePresence>
          {spinning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: "4px solid transparent",
                borderTopColor: "rgba(147,197,253,0.7)",
                borderRightColor: "rgba(96,165,250,0.3)",
                animation: "wheelSpin 0.7s linear infinite",
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Hint text (Can be hidden via props) */}
      {!hideControls && !spinning && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/40 text-xs tracking-widest uppercase text-center"
        >
          Arrasta a roleta ou clica no botão
        </motion.p>
      )}

      {/* Manual Spin Button (Can be hidden via props if parent provides its own button) */}
      {!hideControls && (
        <motion.button
          onClick={handleSpinButton}
          disabled={spinning}
          className="relative px-12 py-4 rounded-2xl font-extrabold text-lg tracking-wider text-white overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
          whileHover={!spinning ? { scale: 1.06 } : {}}
          whileTap={!spinning ? { scale: 0.94 } : {}}
          style={{
            background: "linear-gradient(135deg, #2563eb, #1e40af)",
            boxShadow: "0 0 36px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.3)",
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            {spinning
              ? <><Loader2 className="w-5 h-5 animate-spin" /> A Rodar...</>
              : <><Dices className="w-5 h-5" /> Rodar a Roleta!</>
            }
          </span>
          {/* Button shine animation */}
          {!spinning && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            />
          )}
        </motion.button>
      )}

      {/* CSS animation defined inline for the spinning halo effect */}
      <style>{`
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}