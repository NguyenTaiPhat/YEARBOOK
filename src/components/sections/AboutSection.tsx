"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap } from "@/components/ui/Icons";

const smoothEase = [0.16, 1, 0.3, 1] as [number, number, number, number];
const revealTransition = { duration: 0.82, ease: smoothEase };

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about-section" className="py-24 md:py-32 bg-[var(--bg-secondary)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[var(--soft-gold)] opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-[var(--warm-sand)] opacity-10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={revealTransition}
        >
          <h2
            className="text-4xl md:text-5xl text-[var(--text-primary)] mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Reason For This Website
          </h2>
        </motion.div>

        {/* Profile */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-8 glass rounded-3xl p-8"
          initial={{ opacity: 0, y: 22, scale: 0.985, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ ...revealTransition, delay: 0.16 }}
        >
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[var(--soft-gold)] border-opacity-40 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avt.png"
                alt="Nguyễn Tài Phát"
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-[var(--soft-gold)] text-white shadow-[0_12px_28px_rgba(184,147,103,0.34)]"
              animate={{ y: [0, -3, 0], boxShadow: [
                "0 12px 28px rgba(184,147,103,0.34)",
                "0 18px 40px rgba(184,147,103,0.46)",
                "0 12px 28px rgba(184,147,103,0.34)",
              ] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                className="flex items-center justify-center"
                animate={{ rotate: [0, 8, -6, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <GraduationCap size={19} />
              </motion.span>
            </motion.div>
          </div>
          <div className="text-center md:text-left">
            <h3
              className="text-3xl text-[var(--text-primary)] mb-1"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Nguyễn Tài Phát
            </h3>
            <p className="text-[var(--soft-gold)] text-sm font-medium tracking-widest mb-3">2023–2026</p>
            <p className="text-[var(--text-secondary)] leading-relaxed max-w-md">
Tui cứ nghĩ mãi rằng mực ký trên áo rồi cũng sẽ phai, còn chiếc áo thì chẳng ai biết sau này có còn giữ được hay không. Nên tui quyết định làm trang web này như một nơi để lưu giữ những lời nhắn và kỷ niệm của mọi người cho tui, để dù thời gian có trôi qua bao lâu, những ký ức ấy vẫn sẽ còn mãi.            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
