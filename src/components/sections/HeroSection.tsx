"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, BookOpen, Star } from "@/components/ui/Icons";

export function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scrollToContent = () => {
    document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero-section"
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: "600px" }}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wall.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 z-10 bg-black/40" />
      <div className="absolute inset-0 z-10 hero-overlay opacity-90" />



      {/* Hero content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Class badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-[rgba(184,147,103,0.6)] bg-black/30 backdrop-blur-md shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className="text-[#E7D3BE]">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none" display="inline-block" style={{verticalAlign:'middle'}}><path d="M7 0L8.5 5.5H14L9.5 8.5L11 14L7 10.5L3 14L4.5 8.5L0 5.5H5.5L7 0Z" fill="currentColor"/></svg>
            </span>
            <span className="text-[#E7D3BE] text-sm font-semibold tracking-widest uppercase drop-shadow-sm">
              A19 KHÔNG 9 CŨNG 10
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            className="font-playfair text-white mb-3 drop-shadow-2xl"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: isMobile ? "clamp(2.5rem, 10vw, 3.5rem)" : "clamp(3.5rem, 7vw, 6rem)",
              lineHeight: 1.1,
              textShadow: "0 4px 30px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.5)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
          >
            MY YEARBOOK
          </motion.h1>

          {/* Year */}
          <motion.p
            className="text-[#E7D3BE] mb-2 tracking-[0.3em] text-sm md:text-base uppercase font-semibold drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.1 }}
          >
            2023 — 2026
          </motion.p>

          {/* Name */}
          <motion.p
            className="text-[var(--soft-gold)] mb-8 text-xl md:text-2xl drop-shadow-lg"
            style={{ fontFamily: "var(--font-handwriting), cursive" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.2 }}
          >
            Nguyễn Tài Phát
          </motion.p>

          {/* Quote */}
          <motion.blockquote
            className="text-white text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed italic drop-shadow-lg font-medium"
            style={{ fontFamily: "var(--font-handwriting), cursive", fontSize: isMobile ? "18px" : "22px" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.4 }}
          >
            &ldquo;Một chương sẽ khép lại, nhưng ký ức sẽ mãi ở lại.&rdquo;
          </motion.blockquote>


        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[#C4B5A8] hover:text-white transition-colors cursor-pointer drop-shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        id="scroll-down-indicator"
        aria-label="Cuộn xuống"
      >
        <span className="text-xs tracking-widest uppercase">Khám phá</span>
        <ChevronDown size={20} className="animate-bounce-scroll" />
      </motion.button>


    </section>
  );
}
