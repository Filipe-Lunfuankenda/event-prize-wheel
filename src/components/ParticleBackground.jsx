/**
 * ParticleBackground Component
 * 
 * An HTML5 Canvas component that renders a constellation-like web of floating particles.
 * Particles move randomly and draw connecting lines to each other when they get close.
 * Used primarily on the Home page to add a dynamic, high-tech feel to the background.
 */

import React, { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let animId; // Stores the requestAnimationFrame ID for cleanup
    let particles = []; // Array to hold the state of all particles

    // Handle canvas resizing to match the viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize 50 particles with random positions, velocities, and opacities
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5, // radius
        dx: (Math.random() - 0.5) * 0.4, // x velocity
        dy: (Math.random() - 0.5) * 0.4, // y velocity
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    /**
     * The main animation loop.
     * Clears the canvas, moves the particles, and draws them along with their connections.
     */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update positions and draw dots
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        
        // Bounce off the screen edges by reversing velocity
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        
        // Draw the particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${p.opacity})`; // Blueish tint
        ctx.fill();
      });

      // Draw web connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // If particles are within a threshold distance, draw a line between them
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // Opacity of the line increases as the particles get closer
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      // Request next frame
      animId = requestAnimationFrame(animate);
    };
    
    // Start animation loop
    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // Fixed behind everything, filling the screen, ignores pointer events
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}