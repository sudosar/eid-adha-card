/* Pre-dawn desert sky with golden sunrise glow at the horizon */

export function SunriseSky() {
  return (
    <>
      {/* Base sky gradient — deep purple pre-dawn */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, #0D0820 0%, #1a1035 30%, #3D1550 55%, #8B2252 72%, #C45C1A 84%, #E8850A 92%, #F5C020 100%)",
        }}
      />

      {/* Horizon radial glow — the sun peeking up */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 35% at 50% 100%, rgba(245, 192, 32, 0.55) 0%, rgba(228, 112, 12, 0.3) 35%, transparent 70%)",
        }}
      />

      {/* Atmospheric haze band at horizon */}
      <div
        className="absolute left-0 right-0 z-[2] pointer-events-none"
        style={{
          bottom: "25%",
          height: "15%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(245, 160, 20, 0.12) 50%, transparent 100%)",
          filter: "blur(8px)",
        }}
      />

      {/* Top vignette to deepen the sky */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(13, 8, 32, 0.6) 0%, transparent 60%)",
        }}
      />
    </>
  );
}
