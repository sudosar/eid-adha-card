import { useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  startY: number;
  size: number;
  delay: number;
  duration: number;
}

export function GoldenParticles({ count = 20 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      startY: 40 + Math.random() * 50, // spawn in lower half
      size: Math.random() * 3 + 1,
      delay: Math.random() * 8,
      duration: 5 + Math.random() * 6,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 z-[6] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-up"
          style={{
            left: `${p.x}%`,
            top: `${p.startY}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background:
              "radial-gradient(circle, rgba(240,199,94,0.9) 0%, rgba(212,168,67,0.4) 100%)",
            boxShadow: `0 0 ${p.size * 3}px rgba(240,199,94,0.6)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
