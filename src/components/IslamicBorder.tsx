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
