/*
 * PERSONALIZATION:
 *   ?name=Ahmed  → "Dear Ahmed," at the top
 *   ?msg=From+the+Ali+family → custom sign-off in the bottom zone
 *
 * TEXT LAYOUT:
 *   TOP ZONE: "Dear Name" personalization
 *   MID ZONE: Arabic عيد الأضحى مبارك
 *   BOTTOM ZONE: EID AL-ADHA MUBARAK + blessing + sign-off + year
 */

import { useMemo } from "react";
import { motion } from "framer-motion";

function useUrlParams() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const msg = params.get("msg");
    return {
      name: name ? decodeURIComponent(name).trim() : null,
      msg: msg ? decodeURIComponent(msg).trim() : null,
    };
  }, []);
}

export function GreetingTop() {
  const { name } = useUrlParams();

  return (
    <div className="flex flex-col items-center text-center pointer-events-none">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="mb-2"
        style={{
          height: "1px",
          width: "min(160px, 40vw)",
          background:
            "linear-gradient(90deg, transparent, rgba(240,199,94,0.7), transparent)",
        }}
      />

      {name ? (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="font-body text-lg sm:text-2xl md:text-3xl"
          style={{
            color: "rgba(245, 230, 200, 0.9)",
            letterSpacing: "0.04em",
            textShadow: "0 2px 12px rgba(13,8,32,0.9)",
          }}
        >
          Dear{" "}
          <span style={{ color: "#F0C75E", fontWeight: 700 }}>{name}</span>,
        </motion.p>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="2" fill="rgba(240,199,94,0.7)" />
            <path
              d="M12 2 L13.5 8.5 L20 7 L14.8 11.5 L17.5 18 L12 14 L6.5 18 L9.2 11.5 L4 7 L10.5 8.5 Z"
              fill="none"
              stroke="rgba(240,199,94,0.5)"
              strokeWidth="0.8"
            />
          </svg>
        </motion.div>
      )}
    </div>
  );
}

export function GreetingArabic() {
  return (
    <div className="flex flex-col items-center text-center pointer-events-none">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.9 }}
        className="font-arabic leading-tight"
        style={{
          fontSize: "clamp(2.5rem, 10vw, 5rem)",
          color: "#F0C75E",
          direction: "rtl",
          fontWeight: 700,
          textShadow:
            "0 2px 20px rgba(13,8,32,1), 0 0 40px rgba(13,8,32,0.8), 0 0 30px rgba(240,199,94,0.2)",
        }}
      >
        عيد الأضحى مبارك
      </motion.h1>
    </div>
  );
}

export function GreetingBottom() {
  const { name, msg } = useUrlParams();

  return (
    <div
      className="flex flex-col items-center text-center px-6 pointer-events-none"
      style={{ maxWidth: "min(90vw, 480px)" }}
    >
      {/* Small ornament */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mb-1"
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path
            d="M12 2 L13.8 8.8 L20.6 8.8 L15.4 12.9 L17.2 19.7 L12 15.6 L6.8 19.7 L8.6 12.9 L3.4 8.8 L10.2 8.8 Z"
            fill="rgba(240,199,94,0.7)"
          />
        </svg>
      </motion.div>

      {/* English title */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.3 }}
        className="font-display uppercase tracking-widest"
        style={{
          fontSize: "clamp(1.1rem, 4.5vw, 2rem)",
          color: "#E8DCC8",
          textShadow:
            "0 2px 12px rgba(13,8,32,0.9), 0 0 30px rgba(240,199,94,0.15)",
          letterSpacing: "0.18em",
        }}
      >
        Eid al-Adha Mubarak
      </motion.h2>

      {/* Blessing */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="font-body mt-1 leading-relaxed"
        style={{
          fontSize: "clamp(0.75rem, 2.8vw, 1rem)",
          color: "rgba(245, 230, 200, 0.75)",
          textShadow: "0 1px 8px rgba(13,8,32,0.8)",
          maxWidth: "38ch",
        }}
      >
        {name
          ? `May Allah accept your sacrifice and grant you and your family His infinite mercy and blessings, ${name}`
          : "May Allah accept your sacrifice and grant you and your loved ones His infinite mercy and blessings"}
      </motion.p>

      {/* Custom message sign-off */}
      {msg && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.9 }}
          className="font-body mt-1 italic"
          style={{
            fontSize: "clamp(0.75rem, 2.5vw, 0.95rem)",
            color: "rgba(240,199,94,0.75)",
            letterSpacing: "0.02em",
          }}
        >
          — {msg}
        </motion.p>
      )}

      {/* Arabic du'a */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: msg ? 2.1 : 1.9 }}
        className="font-arabic mt-1"
        style={{
          fontSize: "clamp(1rem, 3.5vw, 1.5rem)",
          color: "rgba(240,199,94,0.7)",
          direction: "rtl",
          fontWeight: 500,
        }}
      >
        تقبّل الله منّا ومنكم صالح الأعمال
      </motion.p>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: msg ? 2.4 : 2.2 }}
        className="mt-2"
        style={{
          height: "1px",
          width: "min(160px, 40vw)",
          background:
            "linear-gradient(90deg, transparent, rgba(240,199,94,0.6), transparent)",
        }}
      />

      {/* Year label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: msg ? 2.6 : 2.4 }}
        className="font-display uppercase mt-1"
        style={{
          fontSize: "clamp(0.55rem, 1.8vw, 0.7rem)",
          color: "rgba(245, 230, 200, 0.4)",
          letterSpacing: "0.3em",
        }}
      >
        Eid al-Adha 1447 AH
      </motion.p>
    </div>
  );
}
