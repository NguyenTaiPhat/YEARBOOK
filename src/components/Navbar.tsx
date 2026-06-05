"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { QrCode, X } from "@/components/ui/Icons";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { MusicPlayer } from "@/components/ui/MusicPlayer";

const NAV_LINKS = [
  { href: "#hero-section", label: "HOME" },
  { href: "#about-section", label: "INFO" },
  { href: "#letter-section", label: "LETTER" },
  { href: "#gallery-section", label: "ALBUM" },
  { href: "#memory-wall", label: "NOTE" },
  { href: "#signature-wall", label: "SIGNATURE" },
  { href: "#contributors-section", label: "CONTRIBUTORS" },
  { href: "#final-section", label: "END" },
];

function QRModal({ onClose }: { onClose: () => void }) {
  const siteUrl = typeof window !== "undefined" ? window.location.href : "https://ourmemories.app";

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[var(--bg-card)] rounded-2xl p-8 max-w-xs w-full text-center shadow-2xl"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" onClick={onClose}>
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-playfair), serif" }}>
          Chia sẻ kỷ yếu
        </h3>
        <p className="text-[var(--text-secondary)] text-xs mb-5">Quét mã QR để ghé thăm lại kỷ yếu này</p>

        {/* Real QR code via qrserver.com free API */}
        <div className="w-52 h-52 mx-auto mb-5 bg-white rounded-xl flex items-center justify-center border border-[var(--border-warm)] p-3 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(siteUrl)}&color=3B3028&bgcolor=ffffff&qzone=1&format=png`}
            alt="QR Code"
            width={180}
            height={180}
            className="w-full h-full object-contain"
          />
        </div>

        <p className="text-[var(--soft-gold)] text-xs font-mono break-all">{siteUrl}</p>
        <p className="text-[var(--text-secondary)] text-xs mt-2" style={{ fontFamily: "var(--font-handwriting), cursive", fontSize: "15px" }}>
          A19 • 2023–2026
        </p>
      </motion.div>
    </motion.div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 80], ["rgba(0,0,0,0)", "rgba(0,0,0,0.85)"]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 60));
    return unsub;
  }, [scrollY]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b transition-colors"
        style={{
          backgroundColor: scrolled ? "var(--bg-card)" : "transparent",
          borderColor: scrolled ? "var(--border-warm)" : "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-base font-semibold transition-colors hover:text-[var(--soft-gold)]"
            style={{
              fontFamily: "var(--font-playfair), serif",
              color: scrolled ? "var(--text-primary)" : "white",
            }}
          >
            12A19 <span className="text-[var(--soft-gold)]"><svg width="10" height="10" viewBox="0 0 14 14" fill="none" style={{display:'inline',verticalAlign:'middle'}}><path d="M7 0L8.5 5.5H14L9.5 8.5L11 14L7 10.5L3 14L4.5 8.5L0 5.5H5.5L7 0Z" fill="currentColor"/></svg></span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium transition-colors hover:text-[var(--soft-gold)]"
                style={{ color: scrolled ? "var(--text-secondary)" : "rgba(255,255,255,0.8)" }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setQrOpen(true)}
              className="w-10 h-10 rounded-full border border-[var(--border-warm)] bg-[var(--bg-card)] bg-opacity-80 flex items-center justify-center hover:border-[var(--soft-gold)] transition-colors"
              whileTap={{ scale: 0.9 }}
              id="qr-code-btn"
              aria-label="QR Code chia sẻ"
            >
              <QrCode size={16} className="text-[var(--soft-gold)]" />
            </motion.button>
            <MusicPlayer />
            <DarkModeToggle />

            {/* Mobile menu btn */}
            <button
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              id="mobile-menu-btn"
            >
              <motion.span
                className="block w-5 h-0.5 bg-current"
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                style={{ color: scrolled ? "var(--text-primary)" : "white" }}
              />
              <motion.span
                className="block w-5 h-0.5 bg-current"
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                style={{ color: scrolled ? "var(--text-primary)" : "white" }}
              />
              <motion.span
                className="block w-5 h-0.5 bg-current"
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                style={{ color: scrolled ? "var(--text-primary)" : "white" }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileOpen(false)} />
            <motion.div
              className="absolute top-14 left-0 right-0 bg-[var(--bg-card)] border-b border-[var(--border-warm)] shadow-xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <div className="px-6 py-6 flex flex-col gap-5">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-left text-base text-[var(--text-primary)] hover:text-[var(--soft-gold)] transition-colors font-medium tracking-wide"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <AnimatePresence>
        {qrOpen && <QRModal onClose={() => setQrOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
