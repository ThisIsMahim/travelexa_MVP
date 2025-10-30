import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoaderProps {
  progress: number;
  total: number;
  onLoaded: () => void;
}

export default function Loader({ progress, total, onLoaded }: LoaderProps) {
  const [showIntro, setShowIntro] = useState(true);
  const percent = Math.min(100, Math.round((progress / total) * 100));

  useEffect(() => {
    // Show brand intro first (2 seconds)
    const introTimer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (percent >= 100 && !showIntro) {
      const timeout = setTimeout(() => onLoaded(), 1000);
      return () => clearTimeout(timeout);
    }
  }, [percent, showIntro, onLoaded]);

  return (
    <AnimatePresence>
      {(percent < 100 || showIntro) && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 animate-bgPulse"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(203,177,106,0.12), transparent 70%), radial-gradient(circle at 70% 70%, rgba(203,177,106,0.05), rgba(0,0,0,0.9))",
              }}
            ></div>
            <div className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "url('https://www.transparenttextures.com/patterns/noisy-grid.png')",
              }}
            ></div>
          </div>

          {/* Glowing rotating ring */}
          <motion.div
            className="relative mb-10"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
          >
            <div
              className="w-28 h-28 border-[3px] rounded-full"
              style={{
                borderColor: "#CBB16A transparent #CBB16A transparent",
              }}
            />
            <div className="absolute inset-0 w-44 h-44 blur-3xl bg-[#CBB16A]/20 rounded-full"></div>
          </motion.div>

          {/* --- Brand Intro --- */}
          {showIntro ? (
            <motion.div
              className="flex flex-col items-center gap-2 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-3xl md:text-4xl font-black text-[#CBB16A] tracking-wide drop-shadow-lg">
                Travelexa
              </h1>
              <p className="text-gray-300 text-sm uppercase tracking-widest drop-shadow-md">
                in collaboration with
              </p>
              <p className="text-[#CBB16A] text-lg font-semibold tracking-wide drop-shadow-lg">
                SkyBridge Digital
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* --- Loading Text --- */}
              <p className="text-center text-lg md:text-xl font-semibold text-[#CBB16A] mb-4 drop-shadow-lg">
                Loading a smooth experience for you
                <br />
                <span className="text-gray-300 text-sm drop-shadow-md">
                  — by <span className="text-[#CBB16A] font-bold">SkyBridge Digital Team</span>
                </span>
              </p>

              {/* --- Progress Bar --- */}
              <div className="relative w-56 h-1.5 bg-gray-800 mt-2 rounded-full overflow-hidden shadow-lg">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-[#CBB16A] shadow-sm"
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>

              {/* --- Percentage --- */}
              <p className="mt-3 text-gray-400 text-sm drop-shadow-md font-medium">
                {percent}%
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
