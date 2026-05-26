import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toggleAudio, isAudioPlaying, onAudioStateChange } from "./audioContext";

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    setIsPlaying(isAudioPlaying());
    return onAudioStateChange((playing) => {
      setIsPlaying(playing);
      if (playing) setShowHint(false);
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(t);
  }, []);

  const handleToggle = useCallback(() => toggleAudio(), []);

  return (
    <div className="absolute bottom-12 left-4 sm:left-6 z-50 flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className="w-10 h-10 rounded-full flex items-center justify-center relative"
        style={{
          background: isPlaying ? "rgba(240,199,94,0.18)" : "rgba(13,8,32,0.65)",
          border: "1px solid rgba(240,199,94,0.35)",
          backdropFilter: "blur(12px)",
          color: "#F0C75E",
        }}
        title={isPlaying ? "Mute" : "Play music"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.svg
              key="on"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </motion.svg>
          ) : (
            <motion.svg
              key="off"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </motion.svg>
          )}
        </AnimatePresence>

        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ border: "1px solid rgba(240,199,94,0.3)" }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {showHint && !isPlaying && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: [0.5, 1, 0.5], x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ opacity: { duration: 2, repeat: Infinity }, x: { duration: 0.3 } }}
            className="font-body text-[10px] sm:text-xs whitespace-nowrap pointer-events-none"
            style={{ color: "rgba(240,199,94,0.6)" }}
          >
            Tap for music ♪
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
