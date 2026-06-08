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
  const [copied, setCopied] = useState(false);
  const siteUrl = typeof window !== "undefined" ? window.location.href : "https://ourmemories.app";

  const handleCopy = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-[#dac29d] bg-[#f6ebda] shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), linear-gradient(transparent 0px, transparent 34px, rgba(0,0,0,0.03) 34px, rgba(0,0,0,0.03) 35px)",
          backgroundSize: "100% 100%, 100% 35px",
        }}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(240,214,176,0.26),transparent_42%)]" />
        <div className="absolute -left-10 top-12 h-40 w-20 rotate-12 rounded-tr-[2rem] bg-[#e6d0ac] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]" />
        <div className="absolute right-6 top-20 h-48 w-24 -rotate-12 rounded-bl-[2rem] bg-[#efe4d4] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]" />

        <button
          className="absolute right-4 top-4 z-20 rounded-full border border-[#c9b48f] bg-[#fbf1db] p-2 text-[#5d4934] transition-colors hover:border-[#ad8b4f] hover:text-[#7c5d2f]"
          onClick={onClose}
          aria-label="Đóng"
        >
          <X size={20} />
        </button>

        <div className="relative px-8 pb-10 pt-12 text-center">
          <div className="absolute left-1/2 top-6 h-3 w-20 -translate-x-1/2 rounded-full bg-[#d7c08b]/90 shadow-[0_1px_8px_rgba(0,0,0,0.08)]" />
          <div className="absolute left-8 top-24 h-24 w-0.5 rounded-full bg-[#c9ae7b]/40" />
          <div className="absolute right-8 top-24 h-24 w-0.5 rounded-full bg-[#c9ae7b]/40" />
          <h3 className="text-2xl font-semibold text-[#3b2d19] mb-2" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Mang kỷ niệm theo cùng
          </h3>
          <p className="text-[0.8rem] tracking-[0.24em] text-[#987948] mb-6 uppercase">
            Quét mã QR để ghé thăm lại kỷ yếu này
          </p>

          <div className="relative mx-auto mb-6 flex w-[19rem] items-center justify-center rounded-[1.9rem] bg-[#fffdf6] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.16)] ring-1 ring-[#d5bf96]/70">
            <div className="absolute left-1/2 top-0 h-9 w-24 -translate-x-1/2 rounded-b-[1rem] bg-[#e8d2a8] shadow-[0_10px_20px_rgba(0,0,0,0.1)] rotate-[3deg]" />
            <div className="absolute right-4 top-8 h-12 w-3 rounded-full bg-[#c8b082]/70" />
            <div className="absolute left-4 top-12 h-12 w-3 rounded-full bg-[#c8b082]/70" />
            <div className="flex h-48 w-48 items-center justify-center rounded-[1.8rem] bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] ring-1 ring-[#e3d3b0]/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(siteUrl)}&color=3B3028&bgcolor=ffffff&qzone=1&format=png`}
                alt="QR Code"
                width={220}
                height={220}
                className="h-full w-full rounded-[1.5rem] object-contain"
              />
            </div>
          </div>

          <p className="text-sm text-[#5f4c39] mb-4 px-3">
            Mở camera hoặc sao chép link để lưu giữ kỷ niệm cùng bạn bè.
          </p>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center rounded-full border border-[#b2955f] bg-[#f6e5c0] px-6 py-2.5 text-sm font-medium text-[#755c31] transition hover:bg-[#f0d1a6]"
          >
            {copied ? "Đã sao chép" : "Sao chép đường dẫn"}
          </button>

          <p className="text-[0.72rem] font-mono text-[#7a654b] break-all mt-4 px-3 leading-5">
            {siteUrl}
          </p>
          <p className="text-xs mt-3 text-[#7a6750]" style={{ fontFamily: "var(--font-handwriting), cursive", fontSize: "15px" }}>
            Một lần là bạn, cả đời là kỷ niệm
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Navbar({ onEditProfile }: { onEditProfile?: () => void }) {
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
            {onEditProfile && (
              <button
                type="button"
                onClick={onEditProfile}
                className="hidden lg:inline-flex items-center rounded-full border border-[var(--border-warm)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--soft-gold)] hover:text-[var(--text-primary)]"
              >
                Chỉnh sửa hồ sơ
              </button>
            )}
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
                {onEditProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      onEditProfile();
                      setMobileOpen(false);
                    }}
                    className="text-left text-base text-[var(--text-primary)] hover:text-[var(--soft-gold)] transition-colors font-medium tracking-wide"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    Chỉnh sửa hồ sơ
                  </button>
                )}
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
