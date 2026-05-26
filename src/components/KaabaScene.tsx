/*
 * The Kaaba — a dignified, respectful SVG silhouette.
 * Rendered as: dark cube with the Kiswah (black cloth), golden Hizam belt,
 * a subtle door outline, and small crescent + star on top.
 * Tapping the Kaaba triggers a golden glow pulse.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function KaabaScene() {
  const [glowing, setGlowing] = useState(false);

  const handleTap = useCallback(() => {
    if (glowing) return;
    setGlowing(true);
    setTimeout(() => setGlowing(false), 1800);
  }, [glowing]);

  return (
    <div
      className="absolute z-[10] flex items-end justify-center pointer-events-none"
      style={{
        bottom: "24%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
      }}
    >
      {/* Glow halo behind the Kaaba */}
      <AnimatePresence>
        {glowing && (
          <motion.div
            key="halo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "min(180px, 40vw)",
              height: "min(180px, 40vw)",
              background:
                "radial-gradient(circle, rgba(240,199,94,0.55) 0%, rgba(240,199,94,0.2) 50%, transparent 75%)",
              bottom: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* Horizon glow bloom beneath the Kaaba */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -8,
          width: "min(220px, 50vw)",
          height: "40px",
          background:
            "radial-gradient(ellipse at center, rgba(245,192,32,0.5) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />

      {/* The Kaaba SVG — tappable */}
      <motion.div
        className="relative cursor-pointer pointer-events-auto"
        onClick={handleTap}
        whileTap={{ scale: 0.97 }}
        animate={
          glowing
            ? { filter: "drop-shadow(0 0 24px rgba(240,199,94,0.9))" }
            : { filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.6))" }
        }
        transition={{ duration: 0.4 }}
        style={{ width: "min(140px, 32vw)", userSelect: "none" }}
      >
        <KaabaSVG />
      </motion.div>
    </div>
  );
}

function KaabaSVG() {
  return (
    <svg
      viewBox="0 0 140 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto" }}
    >
      {/* Main body — deep black cloth */}
      <rect x="10" y="30" width="120" height="120" fill="#0A0806" />

      {/* Side perspective panel (slight 3D effect) */}
      <path
        d="M130 30 L140 22 L140 152 L130 150 Z"
        fill="#111008"
      />

      {/* Kiswah top overlay — rich black with slight sheen */}
      <rect
        x="10"
        y="30"
        width="120"
        height="120"
        fill="url(#kiswahGradient)"
      />

      {/* Golden Hizam belt — horizontal gold band at ~40% height */}
      <rect
        x="10"
        y="72"
        width="120"
        height="14"
        fill="url(#hizamGradient)"
      />

      {/* Hizam border lines */}
      <line x1="10" y1="72" x2="130" y2="72" stroke="rgba(240,199,94,0.5)" strokeWidth="0.5" />
      <line x1="10" y1="86" x2="130" y2="86" stroke="rgba(240,199,94,0.5)" strokeWidth="0.5" />

      {/* Hizam decorative pattern — repeated diamonds */}
      {[20, 35, 50, 65, 80, 95, 110].map((x) => (
        <path
          key={x}
          d={`M${x} 79 L${x + 5} 74 L${x + 10} 79 L${x + 5} 84 Z`}
          fill="rgba(240,199,94,0.25)"
          stroke="rgba(240,199,94,0.5)"
          strokeWidth="0.4"
        />
      ))}

      {/* Kaaba door — Bab al-Kaaba */}
      <rect x="52" y="110" width="36" height="40" rx="3" fill="#14100A" />
      <rect x="54" y="112" width="32" height="38" rx="2" fill="#1a1408" />
      {/* Door frame */}
      <rect x="52" y="110" width="36" height="40" rx="3" fill="none" stroke="rgba(212,168,67,0.7)" strokeWidth="1.2" />
      {/* Door handle */}
      <circle cx="70" cy="134" r="2.5" fill="rgba(212,168,67,0.8)" />
      {/* Door arch detail */}
      <path d="M56 120 Q70 114 84 120" stroke="rgba(212,168,67,0.4)" strokeWidth="0.8" fill="none" />

      {/* Arabic calligraphy hint on Hizam (decorative lines) */}
      <line x1="18" y1="77" x2="48" y2="77" stroke="rgba(240,199,94,0.3)" strokeWidth="0.8" />
      <line x1="92" y1="77" x2="122" y2="77" stroke="rgba(240,199,94,0.3)" strokeWidth="0.8" />
      <line x1="18" y1="81" x2="48" y2="81" stroke="rgba(240,199,94,0.2)" strokeWidth="0.5" />
      <line x1="92" y1="81" x2="122" y2="81" stroke="rgba(240,199,94,0.2)" strokeWidth="0.5" />

      {/* Roof edge highlight */}
      <line x1="10" y1="30" x2="130" y2="30" stroke="rgba(212,168,67,0.6)" strokeWidth="1" />
      <line x1="10" y1="150" x2="130" y2="150" stroke="rgba(212,168,67,0.4)" strokeWidth="0.6" />

      {/* Crescent and star on top */}
      <g transform="translate(62, 8)">
        {/* Crescent */}
        <path
          d="M8 0 C2 0 -2 5 -2 11 C-2 17 2 22 8 22 C5 22 0 19 -2 15 C-4 11 -4 7 -2 3 C0 -1 5 -2 8 0Z"
          fill="rgba(240,199,94,0.85)"
        />
        {/* Star */}
        <path
          d="M14 8 L15.2 11.5 L18.9 11.5 L16 13.7 L17.1 17.2 L14 15.1 L10.9 17.2 L12 13.7 L9.1 11.5 L12.8 11.5 Z"
          fill="rgba(240,199,94,0.85)"
        />
      </g>

      {/* Bottom shadow */}
      <rect x="10" y="145" width="120" height="5" fill="rgba(0,0,0,0.4)" />

      <defs>
        <linearGradient id="kiswahGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(15,10,5,0.4)" />
          <stop offset="40%" stopColor="rgba(10,8,6,0)" />
          <stop offset="100%" stopColor="rgba(5,3,2,0.3)" />
        </linearGradient>
        <linearGradient id="hizamGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(140,90,20,0.7)" />
          <stop offset="25%" stopColor="rgba(212,168,67,0.9)" />
          <stop offset="50%" stopColor="rgba(240,199,94,1)" />
          <stop offset="75%" stopColor="rgba(212,168,67,0.9)" />
          <stop offset="100%" stopColor="rgba(140,90,20,0.7)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
