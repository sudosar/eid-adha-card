import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;      // start x (clientX)
  y: number;      // start y (clientY)
  drift: number;  // final horizontal offset
  rise: number;   // how high it floats (px)
  size: number;
  delay: number;
  isMain: boolean;
}

let nextId = 0;

export function useDuaParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const spawn = useCallback((clientX: number, clientY: number) => {
    // 3 particles per tap — one bright orb + two smaller sparkles
    const batch: Particle[] = [0, 1, 2].map((i) => {
      const id = ++nextId;
      return {
        id,
        x: clientX,
        y: clientY,
        drift: (Math.random() - 0.5) * 70 + (i - 1) * 22,
        rise: 270 + Math.random() * 170,
        size: i === 0 ? 9 : 3 + Math.random() * 2.5,
        delay: i * 0.07,
        isMain: i === 0,
      };
    });

    setParticles((prev) => [...prev.slice(-36), ...batch]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !batch.some((b) => b.id === p.id))
      );
    }, 3800);
  }, []);

  return { particles, spawn };
}

export function DuaParticleLayer({ particles }: { particles: Particle[] }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 32 }}
    >
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
            animate={{
              x: p.x + p.drift,
              y: p.y - p.rise,
              opacity: p.isMain ? [0, 1, 0.75, 0] : [0, 0.8, 0.5, 0],
              scale: p.isMain ? [0, 1, 0.9, 0.3] : [0, 1, 0.7, 0.1],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.isMain ? 3.0 : 2.6,
              delay: p.delay,
              ease: [0.22, 0.61, 0.36, 1],
            }}
            style={{
              position: "absolute",
              top: 0,
              left: -p.size / 2,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.isMain
                ? "radial-gradient(circle, rgba(255,248,180,1) 0%, rgba(240,199,94,0.95) 55%, transparent 100%)"
                : "rgba(240,210,100,0.9)",
              boxShadow: p.isMain
                ? "0 0 10px 3px rgba(240,199,94,0.85), 0 0 28px 6px rgba(240,199,94,0.3)"
                : "0 0 5px 1px rgba(240,199,94,0.55)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
