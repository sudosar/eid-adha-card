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

    </>
  );
}

function OrnamentCrescent() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 12 C19 7.58 15.87 3.9 11.7 3 C15.1 4.5 17.5 8.0 17.5 12 C17.5 16.0 15.1 19.5 11.7 21 C15.87 20.1 19 16.42 19 12Z"
        fill="rgba(240,199,94,0.7)"
      />
    </svg>
  );
}
