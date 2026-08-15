/**
 * PrizeModal Component
 * 
 * This component is responsible for displaying the final outcome of the wheel spin.
 * It renders an animated popup using Framer Motion, triggers celebratory confetti, 
 * and shows an animated canvas icon corresponding to the won prize.
 */

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti"; // External library for particle/confetti effects
import { MapPin } from "lucide-react";

/* ─────────────────────────────────────────────
   Animated canvas icons — one per prize type
   These are drawn purely using Canvas 2D API to avoid loading external assets.
   Each uses requestAnimationFrame for continuous, smooth animation loops.
───────────────────────────────────────────── */

/** Animated Ribbon Icon */
function RibbonIcon() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let t = 0, id;
    const draw = () => {
      ctx.clearRect(0, 0, 120, 120);
      const cx = 60, cy = 60;
      t += 0.04;
      const bob = Math.sin(t) * 3; // Vertical bobbing effect

      // Ribbon glow
      ctx.save();
      ctx.shadowColor = "#f472b6"; ctx.shadowBlur = 20;

      // Left wing
      const waveL = Math.sin(t * 1.2) * 5; // Flapping effect
      ctx.beginPath();
      ctx.moveTo(cx, cy + bob);
      ctx.bezierCurveTo(cx - 20 + waveL, cy - 28 + bob, cx - 48, cy - 10 + bob, cx - 38, cy + 16 + bob);
      ctx.bezierCurveTo(cx - 28, cy + 30 + bob, cx - 8 + waveL, cy + 12 + bob, cx, cy + bob);
      const gL = ctx.createLinearGradient(cx - 48, cy - 10, cx, cy + 16);
      gL.addColorStop(0, "#f9a8d4"); gL.addColorStop(0.5, "#ec4899"); gL.addColorStop(1, "#9d174d");
      ctx.fillStyle = gL; ctx.fill();
      // Left wing shine
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy - 14 + bob);
      ctx.bezierCurveTo(cx - 20, cy - 20 + bob, cx - 38, cy - 4 + bob, cx - 28, cy + 8 + bob);
      ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 2; ctx.stroke();

      // Right wing
      const waveR = Math.sin(t * 1.2 + 1) * 5;
      ctx.beginPath();
      ctx.moveTo(cx, cy + bob);
      ctx.bezierCurveTo(cx + 20 - waveR, cy - 28 + bob, cx + 48, cy - 10 + bob, cx + 38, cy + 16 + bob);
      ctx.bezierCurveTo(cx + 28, cy + 30 + bob, cx + 8 - waveR, cy + 12 + bob, cx, cy + bob);
      const gR = ctx.createLinearGradient(cx, cy - 10, cx + 48, cy + 16);
      gR.addColorStop(0, "#fda4af"); gR.addColorStop(0.5, "#f43f5e"); gR.addColorStop(1, "#881337");
      ctx.fillStyle = gR; ctx.fill();
      // Right wing shine
      ctx.beginPath();
      ctx.moveTo(cx + 8, cy - 14 + bob);
      ctx.bezierCurveTo(cx + 20, cy - 20 + bob, cx + 38, cy - 4 + bob, cx + 28, cy + 8 + bob);
      ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 2; ctx.stroke();

      // Bottom tails
      ctx.beginPath();
      ctx.moveTo(cx - 4, cy + 8 + bob);
      ctx.bezierCurveTo(cx - 14, cy + 28 + bob, cx - 22, cy + 46 + bob, cx - 10, cy + 56 + bob);
      const gTL = ctx.createLinearGradient(cx - 14, cy + 8, cx - 10, cy + 56);
      gTL.addColorStop(0, "#ec4899"); gTL.addColorStop(1, "#f9a8d4");
      ctx.strokeStyle = gTL; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 4, cy + 8 + bob);
      ctx.bezierCurveTo(cx + 14, cy + 28 + bob, cx + 22, cy + 46 + bob, cx + 10, cy + 56 + bob);
      ctx.strokeStyle = "#f43f5e"; ctx.lineWidth = 7; ctx.stroke();

      // Center knot
      const kGrad = ctx.createRadialGradient(cx, cy + bob, 0, cx, cy + bob, 12);
      kGrad.addColorStop(0, "#fce7f3"); kGrad.addColorStop(0.5, "#ec4899"); kGrad.addColorStop(1, "#9d174d");
      ctx.beginPath(); ctx.arc(cx, cy + bob, 9, 0, Math.PI * 2);
      ctx.fillStyle = kGrad; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1.5; ctx.stroke();
      
      // knot shine
      ctx.beginPath(); ctx.arc(cx - 2, cy - 2 + bob, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fill();

      ctx.restore();
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} width={120} height={120} style={{ width: 120, height: 120 }} />;
}

/** Animated Pen Icon */
function PenIcon() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let t = 0, id;
    const draw = () => {
      ctx.clearRect(0, 0, 120, 120);
      t += 0.03;
      const tilt = Math.sin(t) * 4;

      ctx.save();
      ctx.translate(60, 60);
      ctx.rotate((-30 + tilt) * Math.PI / 180);

      // Pen body shadow
      ctx.save(); ctx.shadowColor = "#7c3aed"; ctx.shadowBlur = 18;

      // Pen barrel
      const barGrad = ctx.createLinearGradient(-12, -38, 12, -38);
      barGrad.addColorStop(0, "#c4b5fd"); barGrad.addColorStop(0.3, "#8b5cf6");
      barGrad.addColorStop(0.7, "#6d28d9"); barGrad.addColorStop(1, "#4c1d95");
      ctx.beginPath();
      ctx.roundRect(-10, -42, 20, 62, 5);
      ctx.fillStyle = barGrad; ctx.fill();

      // Barrel highlight stripe
      ctx.beginPath();
      ctx.roundRect(-4, -40, 5, 55, 3);
      ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fill();

      // Pen clip
      ctx.beginPath();
      ctx.roundRect(7, -36, 5, 48, 3);
      const clipG = ctx.createLinearGradient(7, 0, 12, 0);
      clipG.addColorStop(0, "#a78bfa"); clipG.addColorStop(1, "#5b21b6");
      ctx.fillStyle = clipG; ctx.fill();
      ctx.beginPath(); ctx.arc(9.5, 12, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ddd6fe"; ctx.fill();

      // Grip section
      const gripG = ctx.createLinearGradient(-10, 18, 10, 18);
      gripG.addColorStop(0, "#7c3aed"); gripG.addColorStop(0.5, "#5b21b6"); gripG.addColorStop(1, "#4c1d95");
      ctx.beginPath(); ctx.roundRect(-10, 18, 20, 12, 2); ctx.fillStyle = gripG; ctx.fill();
      
      // Grip ridges
      for (let i = 0; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(-10, 20 + i*3); ctx.lineTo(10, 20 + i*3);
        ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1; ctx.stroke();
      }

      // Nib
      ctx.beginPath();
      ctx.moveTo(-8, 30); ctx.lineTo(8, 30); ctx.lineTo(0, 52); ctx.closePath();
      const nibG = ctx.createLinearGradient(-8, 30, 8, 52);
      nibG.addColorStop(0, "#e2e8f0"); nibG.addColorStop(0.5, "#94a3b8"); nibG.addColorStop(1, "#475569");
      ctx.fillStyle = nibG; ctx.fill();
      
      // Nib slit
      ctx.beginPath(); ctx.moveTo(0, 34); ctx.lineTo(0, 52);
      ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 1.5; ctx.stroke();
      
      // Ink drop
      const inkPulse = 0.8 + 0.2 * Math.sin(t * 2);
      ctx.beginPath(); ctx.arc(0, 52, 3 * inkPulse, 0, Math.PI * 2);
      ctx.fillStyle = "#7c3aed"; ctx.fill();

      // Cap top
      ctx.beginPath(); ctx.roundRect(-11, -48, 22, 12, 4);
      const capG = ctx.createLinearGradient(-11, -48, 11, -36);
      capG.addColorStop(0, "#ede9fe"); capG.addColorStop(1, "#6d28d9");
      ctx.fillStyle = capG; ctx.fill();
      ctx.beginPath(); ctx.arc(0, -42, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fill();

      ctx.restore(); ctx.restore();
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} width={120} height={120} style={{ width: 120, height: 120 }} />;
}

/** Animated Pencil Icon */
function PencilIcon() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let t = 0, id;
    const draw = () => {
      ctx.clearRect(0, 0, 120, 120);
      t += 0.03;
      const tilt = Math.sin(t * 0.8) * 5;

      ctx.save();
      ctx.translate(60, 60);
      ctx.rotate((25 + tilt) * Math.PI / 180);

      ctx.save(); ctx.shadowColor = "#0891b2"; ctx.shadowBlur = 18;

      // Eraser
      ctx.beginPath(); ctx.roundRect(-10, -52, 20, 14, 4);
      ctx.fillStyle = "#fda4af"; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1; ctx.stroke();
      
      // Eraser ferrule (metal part)
      ctx.beginPath(); ctx.rect(-10, -40, 20, 6);
      ctx.fillStyle = "#cbd5e1"; ctx.fill();
      ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 0.5; ctx.stroke();

      // Wood body — yellow pencil classic style
      const bodyG = ctx.createLinearGradient(-10, 0, 10, 0);
      bodyG.addColorStop(0, "#fef08a"); bodyG.addColorStop(0.35, "#facc15");
      bodyG.addColorStop(0.65, "#eab308"); bodyG.addColorStop(1, "#a16207");
      ctx.beginPath(); ctx.rect(-10, -36, 20, 68); ctx.fillStyle = bodyG; ctx.fill();

      // Grain lines on wood
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(-10 + i * 4, -36); ctx.lineTo(-10 + i * 4, 32);
        ctx.strokeStyle = "rgba(0,0,0,0.07)"; ctx.lineWidth = 1; ctx.stroke();
      }
      
      // Body shine
      ctx.beginPath(); ctx.roundRect(-7, -34, 5, 62, 2);
      ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fill();

      // Wood sharpened cone
      ctx.beginPath();
      ctx.moveTo(-10, 32); ctx.lineTo(10, 32); ctx.lineTo(0, 54); ctx.closePath();
      const woodG = ctx.createLinearGradient(-10, 32, 10, 54);
      woodG.addColorStop(0, "#d97706"); woodG.addColorStop(1, "#92400e");
      ctx.fillStyle = woodG; ctx.fill();

      // Graphite tip
      ctx.beginPath();
      ctx.moveTo(-3, 46); ctx.lineTo(3, 46); ctx.lineTo(0, 56); ctx.closePath();
      ctx.fillStyle = "#374151"; ctx.fill();

      // Writing sparkles (emits particles while animating)
      if (Math.sin(t * 3) > 0.5) {
        ctx.save();
        ctx.translate(16, 50);
        ctx.rotate(t * 2);
        ctx.fillStyle = `rgba(14,165,233,${0.4 + 0.4 * Math.sin(t * 5)})`;
        ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      ctx.restore(); ctx.restore();
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} width={120} height={120} style={{ width: 120, height: 120 }} />;
}

/** Animated Tote Bag Icon */
function BagIcon() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let t = 0, id;
    const draw = () => {
      ctx.clearRect(0, 0, 120, 120);
      t += 0.03;
      const bob = Math.sin(t) * 4;
      const sway = Math.sin(t * 0.7) * 2;

      ctx.save();
      ctx.translate(60, 60 + bob);
      ctx.save(); ctx.shadowColor = "#059669"; ctx.shadowBlur = 22;

      // Bag body
      ctx.beginPath();
      ctx.roundRect(-28 + sway * 0.3, -18, 56, 52, 8);
      const bagG = ctx.createLinearGradient(-28, -18, 28, 34);
      bagG.addColorStop(0, "#6ee7b7"); bagG.addColorStop(0.4, "#10b981");
      bagG.addColorStop(0.8, "#059669"); bagG.addColorStop(1, "#064e3b");
      ctx.fillStyle = bagG; ctx.fill();

      // Bag side shading (gives it a 3D bulk look)
      ctx.beginPath(); ctx.roundRect(16, -18, 12, 52, [0,8,8,0]);
      ctx.fillStyle = "rgba(0,0,0,0.15)"; ctx.fill();
      
      // Bag highlight
      ctx.beginPath(); ctx.roundRect(-26, -16, 10, 48, [8,0,0,8]);
      ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.fill();

      // Front pocket
      ctx.beginPath();
      ctx.roundRect(-18 + sway * 0.2, -2, 36, 28, 5);
      ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1.5; ctx.stroke();

      // Pocket zipper
      const zipPulse = Math.sin(t * 2) * 2;
      ctx.beginPath(); ctx.moveTo(-12 + zipPulse, 12); ctx.lineTo(12 - zipPulse, 12);
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.stroke();
      ctx.beginPath(); ctx.arc(12 - zipPulse, 12, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#f59e0b"; ctx.fill();

      // Handle (sways separately from the body)
      ctx.beginPath();
      ctx.moveTo(-14 + sway, -18);
      ctx.bezierCurveTo(-14 + sway, -44 + sway * 0.5, 14 + sway, -44 + sway * 0.5, 14 + sway, -18);
      ctx.strokeStyle = "#34d399"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.stroke();
      ctx.strokeStyle = "#064e3b"; ctx.lineWidth = 2; ctx.stroke();

      // Decorative dots
      [[-8, 18], [0, 18], [8, 18]].forEach(([dx, dy]) => {
        ctx.beginPath(); ctx.arc(dx, dy, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fill();
      });

      // Stars / sparkles around bag
      [[-36, -10], [36, 5], [-32, 20]].forEach(([sx, sy], i) => {
        const sp = 0.5 + 0.5 * Math.sin(t * 2 + i * 1.5);
        ctx.save(); ctx.globalAlpha = sp * 0.7;
        ctx.fillStyle = "#6ee7b7";
        ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      ctx.restore(); ctx.restore();
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} width={120} height={120} style={{ width: 120, height: 120 }} />;
}

/** Animated Bottle Opener (Wrench) Icon */
function WrenchIcon() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let t = 0, id;
    const draw = () => {
      ctx.clearRect(0, 0, 120, 120);
      t += 0.03;
      const spin = Math.sin(t * 0.6) * 12; // Pendulum swing

      ctx.save();
      ctx.translate(60, 60);
      ctx.rotate((spin) * Math.PI / 180);
      ctx.save(); ctx.shadowColor = "#d97706"; ctx.shadowBlur = 22;

      // Handle
      ctx.beginPath();
      ctx.moveTo(-7, -8); ctx.lineTo(7, -8);
      ctx.lineTo(10, 50); ctx.lineTo(-10, 50); ctx.closePath();
      const handleG = ctx.createLinearGradient(-10, -8, 10, 50);
      handleG.addColorStop(0, "#fde68a"); handleG.addColorStop(0.4, "#f59e0b");
      handleG.addColorStop(0.8, "#d97706"); handleG.addColorStop(1, "#92400e");
      ctx.fillStyle = handleG; ctx.fill();
      
      // Handle ridges for grip
      for (let i = 0; i < 5; i++) {
        ctx.beginPath(); ctx.moveTo(-9 + i * 0.5, 10 + i*7); ctx.lineTo(9 - i * 0.5, 10 + i*7);
        ctx.strokeStyle = "rgba(0,0,0,0.15)"; ctx.lineWidth = 1.5; ctx.stroke();
      }

      // Head of the tool
      const headG = ctx.createRadialGradient(0, -22, 2, 0, -22, 26);
      headG.addColorStop(0, "#fef3c7"); headG.addColorStop(0.4, "#fbbf24");
      headG.addColorStop(0.8, "#b45309"); headG.addColorStop(1, "#78350f");
      ctx.beginPath(); ctx.arc(0, -22, 24, 0, Math.PI * 2);
      ctx.fillStyle = headG; ctx.fill();
      ctx.strokeStyle = "#fde68a"; ctx.lineWidth = 2; ctx.stroke();

      // Jaw opening
      ctx.beginPath(); ctx.arc(0, -22, 14, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(5,10,25,0.9)"; ctx.fill();

      // Center bolt mechanism
      const boltG = ctx.createRadialGradient(-2, -24, 0, 0, -22, 8);
      boltG.addColorStop(0, "#e2e8f0"); boltG.addColorStop(0.6, "#94a3b8");
      boltG.addColorStop(1, "#334155");
      ctx.beginPath(); ctx.arc(0, -22, 7, 0, Math.PI * 2);
      ctx.fillStyle = boltG; ctx.fill();
      
      // Bolt hex lines
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 4, -22 + Math.sin(a) * 4);
        ctx.lineTo(0, -22);
        ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = 1; ctx.stroke();
      }

      // Shine on head
      ctx.beginPath(); ctx.arc(-8, -30, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fill();

      // Spark effect at the jaw
      const sp = (Math.sin(t * 3) + 1) / 2;
      if (sp > 0.7) {
        ctx.save(); ctx.globalAlpha = (sp - 0.7) * 3;
        ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 12;
        ctx.fillStyle = "#fef9c3";
        ctx.beginPath(); ctx.arc(18, -36, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      ctx.restore(); ctx.restore();
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} width={120} height={120} style={{ width: 120, height: 120 }} />;
}

/** Animated Retry (Loser) Icon */
function RetryIcon() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let t = 0, id;
    const draw = () => {
      ctx.clearRect(0, 0, 120, 120);
      t += 0.04;
      const cx = 60, cy = 62;

      ctx.save(); ctx.shadowColor = "#ef4444"; ctx.shadowBlur = 16;

      // Circular arrow background track
      ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(239,68,68,0.2)"; ctx.lineWidth = 8; ctx.stroke();

      // Animated rotating arc
      const arcStart = t * 1.2;
      const arcEnd   = arcStart + Math.PI * 1.5;
      const arcGrad  = ctx.createLinearGradient(
        cx + Math.cos(arcStart) * 30, cy + Math.sin(arcStart) * 30,
        cx + Math.cos(arcEnd)   * 30, cy + Math.sin(arcEnd)   * 30
      );
      arcGrad.addColorStop(0, "rgba(252,165,165,0)");
      arcGrad.addColorStop(0.5, "#f87171");
      arcGrad.addColorStop(1, "#dc2626");
      
      ctx.beginPath(); ctx.arc(cx, cy, 30, arcStart, arcEnd);
      ctx.strokeStyle = arcGrad; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.stroke();

      // Arrowhead at the end of the arc
      const ax = cx + Math.cos(arcEnd) * 30;
      const ay = cy + Math.sin(arcEnd) * 30;
      const perpA = arcEnd + Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax + Math.cos(perpA - 0.4) * 12, ay + Math.sin(perpA - 0.4) * 12);
      ctx.lineTo(ax + Math.cos(perpA + 0.4) * 12, ay + Math.sin(perpA + 0.4) * 12);
      ctx.closePath();
      ctx.fillStyle = "#dc2626"; ctx.fill();

      // Center "X" mark
      const xScale = 0.85 + 0.15 * Math.sin(t * 2);
      ctx.save(); ctx.translate(cx, cy); ctx.scale(xScale, xScale);
      ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.strokeStyle = "#f87171";
      ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(10, 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10, -10);  ctx.lineTo(-10, 10); ctx.stroke();
      ctx.restore();

      // Pulsing outer ring (echo effect)
      const pulseR = 38 + 10 * ((t % (Math.PI * 2)) / (Math.PI * 2));
      const pulseA = 0.4 * (1 - (t % (Math.PI * 2)) / (Math.PI * 2));
      ctx.beginPath(); ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(239,68,68,${pulseA})`; ctx.lineWidth = 3; ctx.stroke();

      ctx.restore();
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} width={120} height={120} style={{ width: 120, height: 120 }} />;
}

/* ─────────────────────────────────────────────
   Prize Configuration Mapping
   Maps each possible prize label to its styling properties,
   icon component, and specific confetti colors.
───────────────────────────────────────────── */
const prizeStyles = {
  "Fita": {
    gradient: "from-pink-500 via-rose-400 to-pink-600",
    glow: "rgba(236,72,153,0.5)",
    icon: <RibbonIcon />,
    message: "Parabéns! Ganhaste uma Fita!",
    confettiColors: ["#ec4899", "#f472b6", "#fce7f3"],
  },
  "Caneta": {
    gradient: "from-violet-500 via-purple-400 to-indigo-600",
    glow: "rgba(139,92,246,0.5)",
    icon: <PenIcon />,
    message: "Parabéns! Ganhaste uma Caneta!",
    confettiColors: ["#8b5cf6", "#a78bfa", "#c4b5fd"],
  },
  "Lápis": {
    gradient: "from-cyan-500 via-teal-400 to-blue-600",
    glow: "rgba(6,182,212,0.5)",
    icon: <PencilIcon />,
    message: "Parabéns! Ganhaste um Lápis!",
    confettiColors: ["#06b6d4", "#22d3ee", "#67e8f9"],
  },
  "Saco": {
    gradient: "from-emerald-500 via-green-400 to-teal-600",
    glow: "rgba(16,185,129,0.5)",
    icon: <BagIcon />,
    message: "Parabéns! Ganhaste um Saco!",
    confettiColors: ["#10b981", "#34d399", "#6ee7b7"],
  },
  "Saca-Cápsulas": {
    gradient: "from-amber-500 via-yellow-400 to-orange-600",
    glow: "rgba(245,158,11,0.5)",
    icon: <WrenchIcon />,
    message: "Parabéns! Ganhaste um Saca-Cápsulas!",
    confettiColors: ["#f59e0b", "#fbbf24", "#fde68a"],
  },
  "Sem Prémio": {
    gradient: "from-red-500 via-rose-500 to-red-600",
    glow: "rgba(239,68,68,0.4)",
    icon: <RetryIcon />,
    message: "Infelizmente não foi desta vez. Tenta novamente!",
    confettiColors: [], // No confetti for losing
  },
};

/**
 * Normalizes the prize label text. 
 * The wheel rendering engine inserts `\n` characters to wrap text inside segments, 
 * but our configuration mapping expects a single space.
 */
function getStyle(label) {
  const normalized = label?.replace("\n", " ");
  return prizeStyles[normalized]
    || prizeStyles[label]
    || prizeStyles["Sem Prémio"]; // Fallback just in case
}

export default function PrizeModal({ prize, onClose }) {
  const style   = getStyle(prize?.label);
  const isRetry = prize?.label === "Sem Prémio";

  /**
   * Confetti effect hook.
   * Fires confetti from both bottom corners and the center if the user won a prize.
   */
  useEffect(() => {
    if (!prize || isRetry) return; // Don't fire on loss
    
    const duration = 3000; // Confetti cannons fire continuously for 3 seconds
    const end = Date.now() + duration;
    
    // Continuous side-cannon frame loop
    const frame = () => {
      confetti({ particleCount: 3, angle: 60,  spread: 55, origin: { x: 0, y: 0.7 }, colors: style.confettiColors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: style.confettiColors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    
    // Initial big burst from the center
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 }, colors: style.confettiColors });
  }, [prize]);

  // Safety check, don't render if no prize is set
  if (!prize) return null;

  return (
    // AnimatePresence is required for Framer Motion to animate components *as they unmount*
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose} // Clicking the background overlay closes the modal
      >
        {/* Dark blurred background overlay */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/70 backdrop-blur-md" />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.3, opacity: 0, rotateY: 90 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="relative z-10 max-w-sm w-full"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
        >
          <div
            className="rounded-3xl p-6 md:p-8 text-center overflow-hidden relative backdrop-blur-2xl"
            style={{
              background: "rgba(10,25,47,0.85)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: `0 0 60px ${style.glow}, 0 0 120px ${style.glow}`, // Dynamic outer glow matching the prize
            }}
          >
            {/* Shiny diagonal sweep effect passing over the modal periodically */}
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                transform: "skewX(-20deg)"
              }}
            />

            {/* Floating light particles inside the modal */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white opacity-20 pointer-events-none"
                initial={{ 
                  x: Math.random() * 300 - 150, 
                  y: Math.random() * 400 - 200, 
                  scale: 0 
                }}
                animate={{ 
                  y: [0, -100], 
                  opacity: [0, 0.4, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2, 
                  repeat: Infinity, 
                  delay: Math.random() * 2 
                }}
              />
            ))}

            {/* Top gradient blur to ground the icon */}
            <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${style.gradient} opacity-20 blur-2xl`} />

            {/* Icon Container with pop-in animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", damping: 10 }}
              className="flex justify-center mb-2 relative z-10"
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${style.glow.replace("0.5","0.12")}, transparent)`,
                  border: `1px solid ${style.glow}`,
                  boxShadow: `0 0 30px ${style.glow}`,
                  padding: "10px",
                }}
              >
                {style.icon}
              </div>
            </motion.div>

            {/* Pulsing ring behind the icon (only for winners) */}
            {!isRetry && (
              <motion.div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-r ${style.gradient} opacity-10`}
                animate={{ scale: [1, 1.6, 1], opacity: [0.1, 0, 0.1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
            )}

            {/* Prize Title text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-2xl md:text-3xl font-extrabold mb-2 relative z-10 bg-gradient-to-r ${style.gradient} bg-clip-text text-transparent`}
            >
              {prize.label.replace("\n", " ")}
            </motion.h2>

            {/* Prize Message text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 text-sm md:text-lg mb-4 md:mb-6 relative z-10"
            >
              {style.message}
            </motion.p>

            {/* Stand instructions — only shown if they actually won a physical item */}
            {!isRetry && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-[10px] md:text-sm text-white/50 mb-4 md:mb-6 relative z-10"
              >
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Dirige-te ao nosso stand para levantar o teu brinde!
                </span>
              </motion.p>
            )}

            {/* Close / Action Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className={`relative z-10 px-10 py-3.5 rounded-2xl font-black text-white uppercase tracking-widest bg-gradient-to-r ${style.gradient} shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all`}
            >
              {isRetry ? "Tentar Outra Vez" : "Excelente!"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}