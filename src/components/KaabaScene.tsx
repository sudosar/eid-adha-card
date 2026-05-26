/*
 * The Kaaba — 3D perspective view (front face + right side + top).
 * Light source: sunrise from the right/horizon, so:
 *   - Front face: medium dark (some ambient light)
 *   - Right side: slightly warmer (catching sunrise glow)
 *   - Top face: darkest (low sunrise doesn't reach the top much)
 * Tapping triggers a golden glow pulse.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function KaabaScene() {
  const [glowing, setGlowing] = useState(false);

  const handleTap = useCallback(() => {
    if (glowing) return;
    setGlowing(true);
    setTimeout(() => setGlowing(false), 2000);
  }, [glowing]);

  return (
    <div
      className="absolute z-[10] flex items-end justify-center pointer-events-none"
      style={{
        bottom: "11%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
      }}
    >
      {/* Glow halo */}
      <AnimatePresence>
        {glowing && (
          <motion.div
            key="halo"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1.6 }}
            exit={{ opacity: 0, scale: 2.2 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "min(200px, 46vw)",
              height: "min(200px, 46vw)",
              background:
                "radial-gradient(circle, rgba(240,199,94,0.5) 0%, rgba(240,199,94,0.18) 50%, transparent 75%)",
              bottom: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* Ground shadow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -4,
          width: "min(240px, 55vw)",
          height: "28px",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Horizon sunrise glow behind the Kaaba */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 0,
          width: "min(280px, 65vw)",
          height: "60px",
          background:
            "radial-gradient(ellipse at center bottom, rgba(245,160,20,0.35) 0%, rgba(196,92,26,0.15) 50%, transparent 75%)",
          filter: "blur(10px)",
        }}
      />

      {/* The Kaaba — tappable */}
      <motion.div
        className="relative cursor-pointer pointer-events-auto"
        onClick={handleTap}
        whileTap={{ scale: 0.97 }}
        animate={
          glowing
            ? { filter: "drop-shadow(0 0 28px rgba(240,199,94,0.95)) drop-shadow(0 0 60px rgba(240,199,94,0.4))" }
            : { filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.7))" }
        }
        transition={{ duration: 0.4 }}
        style={{ width: "min(170px, 40vw)", userSelect: "none" }}
      >
        <KaabaSVG />
      </motion.div>
    </div>
  );
}

/*
 * 3D Kaaba geometry (cabinet projection, light from right/sunrise):
 *
 * Vertices (viewBox 200 x 205):
 *   Front face:  A(18,72)  B(148,72)  C(148,192)  D(18,192)
 *   Right side:  B(148,72) E(182,50)  F(182,170)  C(148,192)
 *   Top face:    A(18,72)  B(148,72)  E(182,50)   G(52,50)
 *
 * Ground line: y=192
 * Pole base: center of top face ≈ (100, 61)
 */
function KaabaSVG() {
  // Hizam at 38–50% of front face height (height = 120)
  const hizamTopFront = 72 + 0.38 * 120; // ~118
  const hizamBotFront = 72 + 0.51 * 120; // ~133

  // Side face: left edge same as front right (148,72→148,192)
  //            right edge E(182,50)→F(182,170), height=120
  const sideH = 120;
  const hizamTopSide = 50 + 0.38 * sideH; // ~96
  const hizamBotSide = 50 + 0.51 * sideH; // ~111

  return (
    <svg
      viewBox="0 0 200 205"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto" }}
    >
      <defs>
        {/* Front face — dark, slight ambient light */}
        <linearGradient id="frontFaceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#120E08" />
          <stop offset="50%" stopColor="#0D0A06" />
          <stop offset="100%" stopColor="#080604" />
        </linearGradient>

        {/* Right side — warmer, catches sunrise glow from right */}
        <linearGradient id="sideFaceGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a1208" />
          <stop offset="100%" stopColor="#2a1e0c" />
        </linearGradient>

        {/* Top face — darkest (low sun, little overhead light) */}
        <linearGradient id="topFaceGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#0A0806" />
          <stop offset="100%" stopColor="#141008" />
        </linearGradient>

        {/* Hizam gold belt */}
        <linearGradient id="hizamFrontGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8B5E14" />
          <stop offset="20%" stopColor="#C49028" />
          <stop offset="50%" stopColor="#F0C75E" />
          <stop offset="80%" stopColor="#C49028" />
          <stop offset="100%" stopColor="#8B5E14" />
        </linearGradient>

        {/* Hizam side — warmer/lighter since sunrise hits this face */}
        <linearGradient id="hizamSideGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C49028" />
          <stop offset="60%" stopColor="#E8B840" />
          <stop offset="100%" stopColor="#D4A030" />
        </linearGradient>

        {/* Kiswah cloth sheen — subtle highlight at top of front face */}
        <linearGradient id="kiswahSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,220,120,0.08)" />
          <stop offset="30%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
        </linearGradient>
      </defs>

      {/* ── TOP FACE (drawn first, behind front/side) ── */}
      <polygon
        points="18,72 148,72 182,50 52,50"
        fill="url(#topFaceGrad)"
      />
      {/* Top face edge highlight */}
      <polyline
        points="18,72 52,50 182,50"
        fill="none"
        stroke="rgba(212,168,50,0.45)"
        strokeWidth="0.8"
      />
      {/* Top face crease lines (flat roof detail) */}
      <line x1="52" y1="50" x2="148" y2="72" stroke="rgba(255,200,80,0.08)" strokeWidth="0.5" />

      {/* ── RIGHT SIDE FACE ── */}
      <polygon
        points="148,72 182,50 182,170 148,192"
        fill="url(#sideFaceGrad)"
      />
      {/* Side face Kiswah calligraphy strip (near top) */}
      <polygon
        points={`148,72 182,50 182,${50 + 22} 148,${72 + 22}`}
        fill="rgba(255,200,80,0.04)"
      />
      {/* Side face Hizam belt */}
      <polygon
        points={`148,${hizamTopFront} 182,${hizamTopSide} 182,${hizamBotSide} 148,${hizamBotFront}`}
        fill="url(#hizamSideGrad)"
      />
      {/* Side Hizam border lines */}
      <line x1="148" y1={hizamTopFront} x2="182" y2={hizamTopSide} stroke="rgba(240,199,94,0.6)" strokeWidth="0.6" />
      <line x1="148" y1={hizamBotFront} x2="182" y2={hizamBotSide} stroke="rgba(240,199,94,0.6)" strokeWidth="0.6" />
      {/* Side face edge (right) */}
      <line x1="182" y1="50" x2="182" y2="170" stroke="rgba(80,55,15,0.8)" strokeWidth="0.8" />

      {/* ── FRONT FACE ── */}
      <rect x="18" y="72" width="130" height="120" fill="url(#frontFaceGrad)" />
      {/* Kiswah cloth sheen */}
      <rect x="18" y="72" width="130" height="120" fill="url(#kiswahSheen)" />

      {/* Calligraphy band near top of front face */}
      <rect x="18" y="72" width="130" height="22" fill="rgba(255,200,80,0.04)" />

      {/* ── FRONT HIZAM BELT ── */}
      <rect
        x="18" y={hizamTopFront}
        width="130" height={hizamBotFront - hizamTopFront}
        fill="url(#hizamFrontGrad)"
      />
      {/* Hizam top/bottom border lines */}
      <line x1="18" y1={hizamTopFront} x2="148" y2={hizamTopFront} stroke="rgba(240,199,94,0.7)" strokeWidth="0.7" />
      <line x1="18" y1={hizamBotFront} x2="148" y2={hizamBotFront} stroke="rgba(240,199,94,0.7)" strokeWidth="0.7" />

      {/* Hizam diamond motifs */}
      {[30, 48, 66, 83, 100, 117, 134].map((x) => {
        const my = (hizamTopFront + hizamBotFront) / 2;
        const half = (hizamBotFront - hizamTopFront) / 2 - 1;
        return (
          <path
            key={x}
            d={`M${x} ${my} L${x + 5} ${my - half} L${x + 10} ${my} L${x + 5} ${my + half} Z`}
            fill="rgba(240,199,94,0.2)"
            stroke="rgba(240,199,94,0.55)"
            strokeWidth="0.4"
          />
        );
      })}

      {/* Decorative calligraphy lines on Hizam */}
      <line x1="26" y1={hizamTopFront + 4} x2="58" y2={hizamTopFront + 4} stroke="rgba(240,199,94,0.3)" strokeWidth="0.9" />
      <line x1="26" y1={hizamBotFront - 4} x2="58" y2={hizamBotFront - 4} stroke="rgba(240,199,94,0.2)" strokeWidth="0.6" />
      <line x1="108" y1={hizamTopFront + 4} x2="140" y2={hizamTopFront + 4} stroke="rgba(240,199,94,0.3)" strokeWidth="0.9" />
      <line x1="108" y1={hizamBotFront - 4} x2="140" y2={hizamBotFront - 4} stroke="rgba(240,199,94,0.2)" strokeWidth="0.6" />

      {/* ── DOOR — Bab al-Kaaba, gold double-panel ── */}
      {/*
       * Real Bab al-Kaaba: gold-plated double door, rectangular with ornate
       * border frame, calligraphic/geometric panel divisions, raised threshold.
       * Center of front face: x=83, door occupies x=61–105, y=146–192.
       */}

      {/* Outer frame surround — dark recess behind the gold frame */}
      <rect x="59" y="144" width="48" height="48" rx="1" fill="#060402" />

      {/* Gold door frame (thick border) */}
      <rect x="61" y="146" width="44" height="46" rx="0.5"
        fill="none" stroke="url(#doorFrameGrad)" strokeWidth="3.5" />

      {/* Left door panel */}
      <rect x="63" y="148" width="19" height="42" fill="url(#doorPanelGrad)" />
      {/* Right door panel */}
      <rect x="84" y="148" width="19" height="42" fill="url(#doorPanelGrad)" />

      {/* Centre split line */}
      <line x1="83.5" y1="148" x2="83.5" y2="190" stroke="#6B4A10" strokeWidth="1" />

      {/* Panel inner border — left */}
      <rect x="65" y="150" width="15" height="38" rx="0.3"
        fill="none" stroke="rgba(240,199,94,0.55)" strokeWidth="0.7" />
      {/* Panel inner border — right */}
      <rect x="86" y="150" width="15" height="38" rx="0.3"
        fill="none" stroke="rgba(240,199,94,0.55)" strokeWidth="0.7" />

      {/* Top decorative band across both panels */}
      <rect x="63" y="148" width="40" height="8" fill="url(#doorTopBandGrad)" />
      <line x1="63" y1="156" x2="103" y2="156" stroke="rgba(120,80,10,0.8)" strokeWidth="0.6" />

      {/* Calligraphic detail lines on top band */}
      <line x1="67" y1="151" x2="80" y2="151" stroke="rgba(240,199,94,0.5)" strokeWidth="0.7" />
      <line x1="87" y1="151" x2="100" y2="151" stroke="rgba(240,199,94,0.5)" strokeWidth="0.7" />
      <line x1="67" y1="154" x2="80" y2="154" stroke="rgba(240,199,94,0.3)" strokeWidth="0.5" />
      <line x1="87" y1="154" x2="100" y2="154" stroke="rgba(240,199,94,0.3)" strokeWidth="0.5" />

      {/* Upper panel section — left & right */}
      <rect x="66" y="158" width="13" height="11" rx="0.3" fill="rgba(180,130,20,0.25)" stroke="rgba(240,199,94,0.4)" strokeWidth="0.5" />
      <rect x="87" y="158" width="13" height="11" rx="0.3" fill="rgba(180,130,20,0.25)" stroke="rgba(240,199,94,0.4)" strokeWidth="0.5" />

      {/* Lower panel section — left & right */}
      <rect x="66" y="171" width="13" height="15" rx="0.3" fill="rgba(180,130,20,0.2)" stroke="rgba(240,199,94,0.35)" strokeWidth="0.5" />
      <rect x="87" y="171" width="13" height="15" rx="0.3" fill="rgba(180,130,20,0.2)" stroke="rgba(240,199,94,0.35)" strokeWidth="0.5" />

      {/* Door handles — small rings near center split */}
      <circle cx="81" cy="170" r="1.8" fill="none" stroke="rgba(240,199,94,0.9)" strokeWidth="1" />
      <circle cx="86" cy="170" r="1.8" fill="none" stroke="rgba(240,199,94,0.9)" strokeWidth="1" />

      {/* Raised threshold step */}
      <rect x="57" y="190" width="52" height="3" rx="0.5" fill="url(#thresholdGrad)" />

      {/* Gradients for door */}
      <defs>
        <linearGradient id="doorFrameGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8B830" />
          <stop offset="40%" stopColor="#F5D060" />
          <stop offset="100%" stopColor="#A07018" />
        </linearGradient>
        <linearGradient id="doorPanelGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8B5E10" />
          <stop offset="30%" stopColor="#C49028" />
          <stop offset="60%" stopColor="#D4A030" />
          <stop offset="100%" stopColor="#9A6A14" />
        </linearGradient>
        <linearGradient id="doorTopBandGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A07018" />
          <stop offset="50%" stopColor="#F0C040" />
          <stop offset="100%" stopColor="#A07018" />
        </linearGradient>
        <linearGradient id="thresholdGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6B4A10" />
          <stop offset="50%" stopColor="#C49028" />
          <stop offset="100%" stopColor="#6B4A10" />
        </linearGradient>
      </defs>

      {/* ── FRONT FACE OUTLINE EDGES ── */}
      {/* Left edge */}
      <line x1="18" y1="72" x2="18" y2="192" stroke="rgba(80,55,15,0.6)" strokeWidth="0.8" />
      {/* Top edge of front face */}
      <line x1="18" y1="72" x2="148" y2="72" stroke="rgba(212,168,50,0.55)" strokeWidth="1" />
      {/* Bottom edge */}
      <line x1="18" y1="192" x2="148" y2="192" stroke="rgba(80,55,15,0.5)" strokeWidth="0.8" />
      {/* Right edge (shared with side face) */}
      <line x1="148" y1="72" x2="148" y2="192" stroke="rgba(60,40,10,0.7)" strokeWidth="0.8" />

      {/* Bottom edge of side face */}
      <line x1="148" y1="192" x2="182" y2="170" stroke="rgba(80,55,15,0.5)" strokeWidth="0.8" />

      {/* ── POLE + CRESCENT + STAR on top ── */}
      {/* Pole — stops at crescent base so it doesn't poke through */}
      <line x1="100" y1="50" x2="100" y2="32" stroke="rgba(212,168,50,0.85)" strokeWidth="1.5" />
      {/* Pole base cap on top face */}
      <ellipse cx="100" cy="50" rx="2" ry="1" fill="rgba(212,168,50,0.7)" />

      {/* Crescent — sits above pole, shifted left of center */}
      <path
        d="M88 6 C81 6 76 11 76 18 C76 25 81 31 88 31 C84 31 78 27 76 22 C74 17 74 12 76 7 C78 2 84 0 88 6Z"
        fill="rgba(240,199,94,0.92)"
      />
      {/* Star — to the right of crescent */}
      <path
        d="M100 9 L101.4 13.4 L106 13.4 L102.6 16 L104 20.4 L100 17.8 L96 20.4 L97.4 16 L94 13.4 L98.6 13.4 Z"
        fill="rgba(240,199,94,0.92)"
      />

      {/* ── GROUND SHADOW beneath Kaaba ── */}
      <ellipse cx="95" cy="196" rx="68" ry="6" fill="rgba(0,0,0,0.35)" />
    </svg>
  );
}
