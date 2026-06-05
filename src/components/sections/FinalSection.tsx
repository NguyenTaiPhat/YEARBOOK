"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { PLACEHOLDER_PHOTOS } from "@/lib/utils";

/* ─── Ambient glow orb ─────────────────────────────────────────────────────── */
function GlowOrb({
  x, y, size, delay, opacity,
}: {
  x: string; y: string; size: number; delay: number; opacity: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x, top: y, width: size, height: size,
        background: "radial-gradient(circle at center, rgba(184,147,103,0.35) 0%, transparent 70%)",
        opacity, filter: "blur(40px)",
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [opacity, opacity * 0.6, opacity] }}
      transition={{ duration: 6 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

/* ─── Self-drawing ornamental line ─────────────────────────────────────────── */
function DrawLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="h-px bg-gradient-to-r from-transparent via-[var(--soft-gold)] to-transparent"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 0.5 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

/* ─── Infinite horizontal photo strip (CSS marquee) ───────────────────────── */
function PhotoStrip({
  photos,
  direction = "left",
  speed = 20,
  opacity = 0.55,
}: {
  photos: string[];
  direction?: "left" | "right";
  speed?: number;
  opacity?: number;
}) {
  // Duplicate 3× for seamless loop
  const track = [...photos, ...photos, ...photos];
  const animName = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="w-full overflow-hidden py-2 relative">


      <div
        className="flex gap-3 will-change-transform"
        style={{
          animation: `${animName} ${speed}s linear infinite`,
          width: "max-content",
          opacity,
        }}
      >
        {track.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 rounded-xl overflow-hidden"
            style={{
              width: 180,
              height: 120,
              border: "1px solid rgba(184,147,103,0.12)",
              filter: "blur(0.3px) brightness(0.75)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover hover:brightness-100 transition-all duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Animated text reveal ─────────────────────────────────────────────────── */
function RevealLine({
  text, className, style, delay = 0,
}: {
  text: string; className?: string; style?: React.CSSProperties; delay?: number;
}) {
  return (
    <motion.span
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.span>
  );
}

/* ─── Main component ────────────────────────────────────────────────────────── */
export function FinalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [photos, setPhotos] = useState<string[]>(PLACEHOLDER_PHOTOS);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const quoteY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  useEffect(() => {
    fetch("/api/drive")
      .then((r) => r.json())
      .then((data) => {
        if (data.photos?.length) {
          setPhotos(data.photos.map((p: { image_url: string }) => p.image_url));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="final-section"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, var(--bg-main) 0%, #161210 50%, #0A0806 100%)",
        minHeight: "100vh",
      }}
    >
      {/* ── CSS keyframes for marquee ── */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* ── Photo strips at top — bridges light section above into dark ── */}
      <div className="relative z-10 w-full flex flex-col gap-1 pt-0">
        <PhotoStrip photos={photos} direction="left"  speed={45} opacity={0.5}  />
        <PhotoStrip photos={photos} direction="right" speed={55} opacity={0.35} />
        <PhotoStrip photos={photos} direction="left"  speed={38} opacity={0.2}  />
      </div>

      {/* ── Ambient glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <GlowOrb x="10%" y="20%" size={400} delay={0}   opacity={0.4} />
        <GlowOrb x="65%" y="55%" size={500} delay={2.5} opacity={0.25} />
        <GlowOrb x="40%" y="80%" size={350} delay={1}   opacity={0.3} />

        {/* Starfield */}
        {Array.from({ length: 55 }).map((_, i) => {
          const left = ((i * 137.508) % 100).toFixed(2);
          const top  = ((i * 97.3)   % 100).toFixed(2);
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[var(--soft-gold)]"
              style={{ left: `${left}%`, top: `${top}%`, width: i % 7 === 0 ? 2 : 1, height: i % 7 === 0 ? 2 : 1, opacity: 0 }}
              animate={{ opacity: [0, 0.55, 0] }}
              transition={{ duration: 3 + (i % 5), delay: (i * 0.18) % 6, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100vh] py-28 px-6 text-center max-w-4xl mx-auto">

        {/* Label */}
        <motion.p
          className="text-[var(--soft-gold)] text-xs font-semibold tracking-[0.35em] uppercase mb-10 opacity-70"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 0.7, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          END OF THE YEARBOOK
        </motion.p>

        {/* Top line */}
        <div className="w-48 mb-10"><DrawLine delay={0.3} /></div>

        {/* Quote */}
        <motion.blockquote style={{ y: quoteY }} className="mb-10">
          <RevealLine text="Chương này có thể đã" delay={0.2}
            className="block text-3xl md:text-5xl lg:text-6xl text-[#F2E8DC]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} />
          <RevealLine text="khép lại, nhưng ký ức" delay={0.4}
            className="block text-3xl md:text-5xl lg:text-6xl text-[#F2E8DC]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} />
          <RevealLine text="sẽ còn mãi mãi." delay={0.6}
            className="block text-3xl md:text-5xl lg:text-6xl text-[var(--soft-gold)]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }} />
        </motion.blockquote>

        {/* Divider */}
        <div className="w-64 mb-10"><DrawLine delay={0.8} /></div>

        {/* Body */}
        <motion.div
          className="space-y-5 mb-14 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.6 }}
        >
          <p className="text-[#C4B5A8] text-base md:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Cảm ơn các bạn đã là một phần trong chương đời đẹp nhất của mình.
          </p>
          <p className="text-[#7A6A5A] text-sm md:text-base leading-loose"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Có thể chúng ta sẽ đi những con đường khác nhau.<br />
            Có thể nhiều năm nữa chúng ta mới gặp lại.<br />
            Nhưng những ký ức này — mãi mãi thuộc về tất cả chúng ta.
          </p>
        </motion.div>

        {/* Signature */}
        <motion.div className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <p className="text-[var(--soft-gold)] text-4xl md:text-5xl mb-2"
            style={{ fontFamily: "var(--font-handwriting), cursive" }}>
            Nguyễn Tài Phát
          </p>
          <p className="text-[#4A3A2A] text-xs tracking-[0.3em] uppercase">
            2023 – 2026
          </p>
        </motion.div>

        {/* Bottom ornament */}
        <div className="w-48 mb-4"><DrawLine delay={1.1} /></div>

        <motion.div className="flex items-center gap-3 mb-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3 }}
        >
          <div className="w-8 h-px bg-[var(--warm-sand)] opacity-30" />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 0L8.5 5.5H14L9.5 8.5L11 14L7 10.5L3 14L4.5 8.5L0 5.5H5.5L7 0Z"
              fill="currentColor" className="text-[var(--soft-gold)]" opacity="0.6" />
          </svg>
          <div className="w-8 h-px bg-[var(--warm-sand)] opacity-30" />
        </motion.div>
      </div>

      {/* Bottom padding only */}
      <div className="pb-16" />
    </section>
  );
}
