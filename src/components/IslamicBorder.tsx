/* Geometric Islamic-inspired border frame */

export function IslamicBorder() {
  return (
    <>
      {/* Top line */}
      <div
        className="absolute left-0 right-0 z-[25] pointer-events-none"
        style={{ top: "3vh" }}
      >
        <div
          className="mx-auto"
          style={{
            height: "1px",
            width: "80%",
            background:
              "linear-gradient(90deg, transparent, rgba(240,199,94,0.6), rgba(240,199,94,0.9), rgba(240,199,94,0.6), transparent)",
          }}
        />
      </div>

      {/* Bottom line */}
      <div
        className="absolute left-0 right-0 z-[25] pointer-events-none"
        style={{ bottom: "3vh" }}
      >
        <div
          className="mx-auto"
          style={{
            height: "1px",
            width: "80%",
            background:
              "linear-gradient(90deg, transparent, rgba(240,199,94,0.6), rgba(240,199,94,0.9), rgba(240,199,94,0.6), transparent)",
          }}
        />
      </div>

      {/* Corner ornaments — 8-pointed star motif */}
      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
        (corner) => (
          <div
            key={corner}
            className="absolute z-[25] pointer-events-none"
            style={{
              top: corner.startsWith("top") ? "2.5vh" : undefined,
              bottom: corner.startsWith("bottom") ? "2.5vh" : undefined,
              left: corner.endsWith("left") ? "5vw" : undefined,
              right: corner.endsWith("right") ? "5vw" : undefined,
            }}
          >
            <OrnamentStar />
          </div>
        )
      )}
    </>
  );
}

function OrnamentStar() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {/* 8-pointed star */}
      <path
        d="M12 2 L13.5 8.5 L20 7 L14.8 11.5 L17.5 18 L12 14 L6.5 18 L9.2 11.5 L4 7 L10.5 8.5 Z"
        fill="none"
        stroke="rgba(240,199,94,0.7)"
        strokeWidth="0.8"
      />
      <circle cx="12" cy="12" r="1.5" fill="rgba(240,199,94,0.6)" />
    </svg>
  );
}
