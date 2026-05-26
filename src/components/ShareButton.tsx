import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function ShareButton() {
  const [open, setOpen] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    } catch {
      toast.error("Copy failed — try manually");
    }
    setOpen(false);
  }, [url]);

  const whatsapp = useCallback(() => {
    const text = `Eid al-Adha Mubarak! I made a special greeting for you: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    setOpen(false);
  }, [url]);

  const nativeShare = useCallback(async () => {
    if ("share" in navigator) {
      try {
        await navigator.share({
          title: "Eid al-Adha Mubarak",
          text: "A personalized Eid al-Adha greeting for you",
          url,
        });
      } catch {
        /* user dismissed */
      }
    }
    setOpen(false);
  }, [url]);

  return (
    <div className="absolute top-4 right-4 z-50">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-body tracking-wide"
        style={{
          background: "rgba(13,8,32,0.6)",
          border: "1px solid rgba(240,199,94,0.3)",
          color: "rgba(240,199,94,0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 flex flex-col gap-1 rounded-xl overflow-hidden"
            style={{
              background: "rgba(13,8,32,0.9)",
              border: "1px solid rgba(240,199,94,0.2)",
              backdropFilter: "blur(16px)",
              minWidth: "140px",
            }}
          >
            {"share" in navigator && (
              <ShareOption icon="↗" label="Share" onClick={nativeShare} />
            )}
            <ShareOption icon="🔗" label="Copy link" onClick={copy} />
            <ShareOption icon="💬" label="WhatsApp" onClick={whatsapp} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShareOption({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 text-xs font-body text-left transition-colors hover:bg-white/5 w-full"
      style={{ color: "rgba(245,230,200,0.85)" }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
