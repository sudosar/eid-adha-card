import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#0D0820" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p
          className="font-arabic text-4xl mb-4"
          style={{ color: "#F0C75E", direction: "rtl" }}
        >
          عيد الأضحى مبارك
        </p>
        <p
          className="font-display text-sm tracking-widest uppercase mb-6"
          style={{ color: "rgba(245,230,200,0.4)" }}
        >
          Page not found
        </p>
        <a
          href="."
          className="font-body text-sm hover:underline"
          style={{ color: "rgba(240,199,94,0.6)" }}
        >
          ← Back to greeting
        </a>
      </motion.div>
    </div>
  );
}
