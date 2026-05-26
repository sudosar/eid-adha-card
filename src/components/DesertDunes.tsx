/* Desert dunes — foreground sandy hills with golden sunrise edge highlights */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

export function DesertDunes() {
  const [shimmer, setShimmer] = useState(false);

  const handleTap = useCallback(() => {
    if (shimmer) return;
    setShimmer(true);
    setTimeout(() => setShimmer(false), 1500);
  }, [shimmer]);

  return (
    <motion.div
      className="absolute left-0 right-0 bottom-0 z-[15] cursor-pointer"
      onClick={handleTap}
      animate={
        shimmer
          ? { filter: "brightness(1.4) saturate(1.3)" }
          : { filter: "brightness(1) saturate(1)" }
      }
      transition={{ duration: 0.3 }}
    >
      <svg
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {/* Back dune — lighter, further away */}
        <path
          d="M0 80 Q60 45 120 60 Q180 75 240 50 Q300 25 360 55 Q390 65 400 60 L400 120 L0 120 Z"
          fill="url(#backDuneGrad)"
        />

        {/* Mid dune */}
        <path
          d="M0 95 Q50 70 100 80 Q160 90 220 68 Q280 48 340 72 Q370 82 400 75 L400 120 L0 120 Z"
          fill="url(#midDuneGrad)"
        />

        {/* Front dune — darkest, closest */}
        <path
          d="M0 108 Q40 90 90 98 Q140 106 200 88 Q260 72 320 92 Q360 104 400 96 L400 120 L0 120 Z"
          fill="url(#frontDuneGrad)"
        />

        {/* Edge highlight — sunrise light catching the dune crests */}
        <path
          d="M0 108 Q40 90 90 98 Q140 106 200 88 Q260 72 320 92 Q360 104 400 96"
          fill="none"
          stroke="rgba(240,199,94,0.35)"
          strokeWidth="1.5"
        />
        <path
          d="M0 95 Q50 70 100 80 Q160 90 220 68 Q280 48 340 72 Q370 82 400 75"
          fill="none"
          stroke="rgba(240,199,94,0.2)"
          strokeWidth="1"
        />

        {/* Sand texture dots */}
        {[20, 50, 80, 120, 160, 210, 260, 300, 340, 370].map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={100 + (i % 3) * 4}
            r="0.8"
            fill="rgba(240,199,94,0.25)"
          />
        ))}

        <defs>
          <linearGradient id="backDuneGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B6030" />
            <stop offset="100%" stopColor="#6B4820" />
          </linearGradient>
          <linearGradient id="midDuneGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9B6E35" />
            <stop offset="100%" stopColor="#7A5028" />
          </linearGradient>
          <linearGradient id="frontDuneGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C4934A" />
            <stop offset="50%" stopColor="#A06B30" />
            <stop offset="100%" stopColor="#7A5028" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
