"use client";

import { useState, useRef } from "react";
import { Music } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";

const MUSIC_URL = "/music.mp3";

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (!MUSIC_URL) {
      setShowLabel(true);
      setTimeout(() => setShowLabel(false), 2000);
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={toggle}
        className="w-10 h-10 rounded-full border border-[var(--border-warm)] bg-[var(--bg-card)] flex items-center justify-center cursor-pointer hover:border-[var(--soft-gold)] transition-colors"
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle background music"
        id="music-toggle"
      >
        <motion.div
          animate={playing ? { rotate: 360 } : { rotate: 0 }}
          transition={playing ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
        >
          <Music size={16} className="text-[var(--soft-gold)]" />
        </motion.div>
        {playing && (
          <motion.div
            className="absolute inset-0 rounded-full border border-[var(--soft-gold)]"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <span className="sr-only">{playing ? "Tắt nhạc" : "Bật nhạc"}</span>
      </motion.button>

      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 right-0 bg-[var(--bg-card)] border border-[var(--border-warm)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)] whitespace-nowrap shadow-lg"
          >
            Chưa có nhạc nền
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
