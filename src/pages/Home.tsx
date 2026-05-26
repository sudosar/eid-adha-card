/*
 * DESIGN: "Desert Dawn" — Golden Sunrise over the Kaaba
 *
 * LAYERS (back to front):
 *   0. Sky gradient (deep purple → amber → gold at horizon)
 *   1. Twinkling stars (fade toward horizon)
 *   2. Horizon glow
 *   3. Kaaba silhouette (interactive — tap for golden glow)
 *   4. Desert dunes (interactive — tap for shimmer)
 *   5. Golden dust particles floating up
 *   6. Islamic geometric border
 *   7. Greeting text zones
 *   8. UI controls (share button, create link)
 *
 * PERSONALIZATION: ?name= and ?msg= query params
 */

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SunriseSky } from "@/components/SunriseSky";
import { TwinklingStars } from "@/components/TwinklingStars";
import { KaabaScene } from "@/components/KaabaScene";
import { DesertDunes } from "@/components/DesertDunes";
import { GoldenParticles } from "@/components/GoldenParticles";
import { IslamicBorder } from "@/components/IslamicBorder";
import { GreetingTop, GreetingArabic, GreetingBottom } from "@/components/GreetingText";
import { ShareButton } from "@/components/ShareButton";
import { AudioPlayer } from "@/components/AudioPlayer";
import { DuaParticleLayer, useDuaParticles } from "@/components/DuaParticles";

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 350);
          return 100;
        }
        return prev + 2.5;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #0D0820 0%, #1a1035 50%, #3D1550 100%)",
      }}
    >
      {/* Crescent + star */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
          {/* Crescent */}
          <path
            d="M45 12C33 12 24 21 24 33C24 45 33 54 45 54C40 54 28 49 23 41C18 33 18 23 23 15C28 7 40 4 45 12Z"
            fill="rgba(240, 199, 94, 0.85)"
          />
          {/* Star */}
          <path
            d="M58 18 L60 24 L66 24 L61.5 27.5 L63.5 33.5 L58 30 L52.5 33.5 L54.5 27.5 L50 24 L56 24 Z"
            fill="rgba(240, 199, 94, 0.85)"
          />
        </svg>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="font-body text-xs tracking-[0.3em] uppercase mb-6"
        style={{ color: "rgba(245, 230, 200, 0.5)" }}
      >
        Eid al-Adha Mubarak
      </motion.p>

      {/* Progress bar */}
      <div
        className="w-44 h-[2px] rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(240,199,94,0.1)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, rgba(240,199,94,0.3), rgba(240,199,94,0.9))",
          }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="font-body text-xs tracking-widest mt-5"
        style={{ color: "rgba(240,199,94,0.4)" }}
      >
        tap to explore
      </motion.p>
    </motion.div>
  );
}

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const { particles, spawn } = useDuaParticles();

  const handleLoadingComplete = useCallback(() => {
    setShowContent(true);
  }, []);

  const handleSkyClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Ignore taps on buttons, links, or the Kaaba (which stops propagation)
      const target = e.target as HTMLElement;
      if (target.closest("button, a")) return;
      spawn(e.clientX, e.clientY);
    },
    [spawn]
  );

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#0D0820" }}
    >
      <AnimatePresence mode="wait">
        {!showContent && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative w-full h-full"
          onClick={handleSkyClick}
        >
          {/* Sky layers */}
          <SunriseSky />

          {/* Stars */}
          <TwinklingStars count={55} />

          {/* Golden dust particles */}
          <GoldenParticles count={18} />

          {/* Kaaba — centered, interactive */}
          <KaabaScene />

          {/* Desert dunes — foreground */}
          <DesertDunes />

          {/* Islamic geometric border */}
          <IslamicBorder />

          {/* Dua particles — spawned on sky tap */}
          <DuaParticleLayer particles={particles} />

          {/* === TEXT ZONES — single flex column filling the sky above the Kaaba === */}
          {/* bottom: 42% keeps the text out of the Kaaba zone (Kaaba top ≈ 58–65% from top) */}
          <div
            className="absolute left-0 right-0 z-[30] flex flex-col items-center justify-evenly pointer-events-none"
            style={{ top: "2vh", bottom: "42%" }}
          >
            <GreetingTop />
            <GreetingArabic />
            <GreetingBottom />
          </div>

          {/* Edge vignette */}
          <div
            className="absolute inset-0 z-[20] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 35%, rgba(13,8,32,0.5) 100%)",
            }}
          />

          {/* UI Controls */}
          <ShareButton />
          <AudioPlayer />

          {/* "Create Your Own" link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50"
          >
            <a
              href="create"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-[10px] sm:text-xs tracking-wide transition-all hover:scale-105"
              style={{
                color: "rgba(240,199,94,0.6)",
                background: "rgba(13,8,32,0.55)",
                border: "1px solid rgba(240,199,94,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Your Own
            </a>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
