"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Camera, CheckCircle, Star } from "@/components/ui/Icons";
import { getVisitorId, markOnboardingComplete, storeProfile } from "@/lib/utils";

interface VisitorProfile {
  name: string;
  avatar_url: string | null;
  memory_message: string | null;
}

interface OnboardingScreenProps {
  onComplete: (profile: VisitorProfile) => void;
  initialProfile?: VisitorProfile;
  mode?: "onboarding" | "edit";
}

type Step = "book" | "form" | "success";

const floatingDetails = [
  { left: "8%", top: "18%", width: 56, delay: 0 },
  { left: "78%", top: "14%", width: 42, delay: 0.35 },
  { left: "14%", top: "72%", width: 38, delay: 0.65 },
  { left: "84%", top: "68%", width: 64, delay: 0.2 },
];

const stepLabels = ["Mở kỷ yếu", "Gửi kỷ niệm", "Hoàn tất"];
const smoothEase = [0.16, 1, 0.3, 1] as [number, number, number, number];
const screenTransition = { duration: 0.82, ease: smoothEase };
const panelSpring = { type: "spring" as const, stiffness: 96, damping: 24, mass: 0.85 };

export function OnboardingScreen({ onComplete, initialProfile, mode = "onboarding" }: OnboardingScreenProps) {
  const [step, setStep] = useState<Step>(mode === "edit" ? "form" : "book");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name);
      setMessage(initialProfile.memory_message ?? "");
      setAvatarPreview(initialProfile.avatar_url ?? null);
    }
  }, [initialProfile]);

  const initials = useMemo(() => {
    const trimmedName = name.trim();
    if (!trimmedName) return "";
    return trimmedName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [name]);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setAvatarPreview(loadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || loading) return;
    setLoading(true);

    const profile: VisitorProfile = {
      name: name.trim(),
      avatar_url: avatarPreview,
      memory_message: message.trim() || null,
    };

    storeProfile(profile);
    markOnboardingComplete();

    let finalProfile = profile;

    try {
      const visitorId = getVisitorId();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && !supabaseUrl.includes("your-project")) {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...profile, visitor_identifier: visitorId }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            finalProfile = {
              name: data.user.name ?? profile.name,
              avatar_url: data.user.avatar_url ?? profile.avatar_url,
              memory_message: data.user.memory_message ?? profile.memory_message,
            };
            storeProfile(finalProfile);
          }
        }
      }
    } catch {
      finalProfile = profile;
    }

    setStep("success");
    setLoading(false);
    window.setTimeout(() => onComplete(finalProfile), 1800);
  };

  return (
    <AnimatePresence mode="wait">
      {step === "book" && (
        <motion.div
          key="book"
          className="fixed inset-0 z-50 overflow-hidden bg-[#15110E] text-[#F7EFE5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.015, filter: "blur(6px)" }}
          transition={screenTransition}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: smoothEase }}
          >
            <Image
              src="/bg.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-25"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,12,10,0.92)_0%,rgba(27,24,21,0.78)_45%,rgba(15,12,10,0.96)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,rgba(184,147,103,0.18),transparent)]" />

          {floatingDetails.map((detail) => (
            <motion.div
              key={`${detail.left}-${detail.top}`}
              className="absolute h-px rounded-full bg-[#D8C0A8]/35"
              style={{ left: detail.left, top: detail.top, width: detail.width }}
              animate={{ opacity: [0.14, 0.5, 0.14], y: [-6, 8, -6], scaleX: [0.82, 1, 0.82] }}
              transition={{ duration: 6.4, repeat: Infinity, delay: detail.delay, ease: "easeInOut" }}
            />
          ))}

          <div className="relative z-10 flex min-h-dvh items-center justify-center px-5 py-10">
            <motion.section
              className="w-full max-w-[430px] border border-[#D8C0A8]/20 bg-[#201B17]/68 p-6 shadow-2xl shadow-black/35 backdrop-blur-xl md:p-8"
              style={{ borderRadius: 8 }}
              initial={{ opacity: 0, y: 28, scale: 0.97, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ ...panelSpring, filter: { duration: 0.5, ease: smoothEase } }}
            >
              <div className="mb-7 flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-[#BFA88D]">
                <span>Yearbook</span>
                <span>2023-2026</span>
              </div>

              <motion.div
                className="mx-auto mb-7 flex h-28 w-28 items-center justify-center rounded-full border border-[#D8C0A8]/35 bg-[#B89367]/15 p-1 shadow-[0_18px_50px_rgba(0,0,0,0.32)]"
                animate={{ y: [0, -7, 0], boxShadow: ["0 18px 50px rgba(0,0,0,0.32)", "0 24px 70px rgba(184,147,103,0.18)", "0 18px 50px rgba(0,0,0,0.32)"] }}
                transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/avt.png"
                  alt="Tài Phát"
                  width={104}
                  height={104}
                  className="h-full w-full rounded-full object-cover"
                  priority
                />
              </motion.div>

              <div className="text-center">
                <h1
                  className="text-4xl leading-tight text-[#FFF8ED] md:text-5xl"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Nguyễn Tài Phát
                </h1>
                <div className="mx-auto my-5 h-px w-20 bg-[#B89367]/70" />
                <p
                  className="mx-auto max-w-sm text-sm leading-7 text-[#D6C5B4] md:text-base"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Hãy để lại một dấu vết nhỏ của bạn trước khi cùng mình mở lại những năm tháng đáng nhớ.
                </p>
              </div>

              <motion.button
                onClick={() => setStep("form")}
                className="group mt-9 inline-flex w-full items-center justify-center gap-3 bg-[#B89367] px-6 py-4 text-sm font-medium uppercase tracking-[0.18em] text-white shadow-lg shadow-[#B89367]/20 outline-none transition-colors hover:bg-[#A07C58] focus-visible:ring-2 focus-visible:ring-[#F2E8DC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#201B17]"
                style={{ borderRadius: 8, fontFamily: "var(--font-playfair), Georgia, serif" }}
                whileHover={{ y: -3, transition: { duration: 0.28, ease: smoothEase } }}
                whileTap={{ scale: 0.98 }}
                id="open-yearbook-btn"
              >
                <motion.span
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/12 text-[#FFF8ED]"
                  animate={{ rotate: [0, 7, -5, 0], scale: [1, 1.06, 1] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Star size={15} />
                </motion.span>
                Mở kỷ yếu
              </motion.button>
            </motion.section>
          </div>
        </motion.div>
      )}

      {step === "form" && (
        <motion.div
          key="form"
          className="fixed inset-0 z-50 overflow-y-auto bg-[#F7F0E7] paper-texture"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.992, filter: "blur(5px)" }}
          transition={screenTransition}
        >
          <Image
            src="/bg.jpg"
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none object-cover opacity-[0.08]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,254,248,0.96)_0%,rgba(255,248,240,0.9)_52%,rgba(231,211,190,0.72)_100%)]" />

          <div className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-6 md:px-8">
            <motion.section
              className="grid w-full max-w-4xl gap-0 overflow-hidden border border-[#E2D4C4]/80 bg-white/72 shadow-[0_28px_80px_rgba(59,48,40,0.16)] backdrop-blur-xl md:grid-cols-[0.88fr_1.12fr]"
              style={{ borderRadius: 8 }}
              initial={{ opacity: 0, y: 24, scale: 0.975, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ ...panelSpring, filter: { duration: 0.5, ease: smoothEase } }}
            >
              <aside className="relative overflow-hidden bg-[#211B16] p-6 text-[#F7EFE5] md:p-8">
                <Image
                  src="/bg.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 360px, 100vw"
                  className="object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(33,27,22,0.72),rgba(33,27,22,0.96))]" />

                <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-between gap-8">
                  <div>
                    <div className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#D8C0A8]">
                      <motion.span
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D8C0A8]/25 bg-[#D8C0A8]/10"
                        animate={{ rotate: [0, 8, 0], opacity: [0.82, 1, 0.82] }}
                        transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Star size={14} />
                      </motion.span>
                      MY YEARBOOK
                    </div>
                    <h2
                      className="text-3xl leading-tight md:text-4xl"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      {mode === "edit" ? "Chỉnh sửa trang cá nhân" : "Trước khi vào kỷ yếu"}
                    </h2>
                    <p
                      className="mt-4 max-w-xs text-sm leading-7 text-[#D6C5B4]"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      {mode === "edit"
                        ? "Cập nhật tên, avatar và lời nhắn để người khác nhận diện bạn dễ hơn."
                        : "Một ngày nào đó, chúng ta sẽ quay lại đây và sống lại những ký ức này cùng nhau."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {stepLabels.map((label, index) => {
                      const active = index === 1;
                      return (
                        <div key={label} className="flex items-center gap-3">
                          <span
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              active ? "bg-[#B89367]" : "bg-[#F2E8DC]/20"
                            }`}
                          />
                          <span className={`text-xs ${active ? "text-[#F7EFE5]" : "text-[#BFA88D]"}`}>
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </aside>

              <div className="p-5 md:p-8">
                <div className="mb-7 flex flex-col items-center text-center">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="group relative h-24 w-24 overflow-hidden rounded-full border border-[#D8C0A8] bg-[#FFF8F1] text-[#8A7A6A] shadow-lg shadow-[#B89367]/10 outline-none transition-all hover:-translate-y-1 hover:border-[#B89367] hover:shadow-xl hover:shadow-[#B89367]/15 focus-visible:ring-2 focus-visible:ring-[#B89367] focus-visible:ring-offset-2 md:h-28 md:w-28"
                    id="avatar-upload-btn"
                    aria-label="Tải ảnh đại diện"
                  >
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarPreview}
                        alt="Ảnh đại diện đã chọn"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex h-full w-full flex-col items-center justify-center gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B89367]/12 text-[#B89367]">
                          <Camera size={20} />
                        </span>
                        <span
                          className="text-xl text-[#3B3028]"
                          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                        >
                          {initials}
                        </span>
                      </span>
                    )}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <p className="mt-3 text-xs text-[#8A7A6A]">Chọn ảnh đại diện để kỷ niệm trông gần gũi hơn.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      className="mb-2 block text-sm text-[#6F5F51]"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                      htmlFor="visitor-name-input"
                    >
                      Tên của bạn <span className="text-[#B89367]">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Nhập tên thật của bạn..."
                      className="w-full border border-[#E2D4C4] bg-white/75 px-4 py-3 text-base text-[#3B3028] outline-none transition-all placeholder:text-[#C8B7A6] focus:border-[#B89367] focus:bg-white focus:shadow-[0_0_0_4px_rgba(184,147,103,0.13)] md:text-lg"
                      style={{ borderRadius: 8, fontFamily: "var(--font-playfair), Georgia, serif" }}
                      id="visitor-name-input"
                      maxLength={50}
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <label
                        className="text-sm text-[#6F5F51]"
                        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                        htmlFor="visitor-message-input"
                      >
                        Lời nhắn nhủ
                      </label>
                      <span className="text-xs text-[#9B8A7A]">không bắt buộc</span>
                    </div>
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Một câu nói, một kỷ niệm, hoặc điều gì đó khiến mình nhớ đến bạn..."
                      maxLength={120}
                      rows={4}
                      className="w-full resize-none border border-[#E2D4C4] bg-white/75 px-4 py-3 text-sm leading-7 text-[#3B3028] outline-none transition-all placeholder:text-[#C8B7A6] focus:border-[#B89367] focus:bg-white focus:shadow-[0_0_0_4px_rgba(184,147,103,0.13)] md:text-base"
                      style={{ borderRadius: 8, fontFamily: "var(--font-playfair), Georgia, serif" }}
                      id="visitor-message-input"
                    />
                    <div className="mt-2 text-right text-xs text-[#B7A694]">{message.length}/120</div>
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!name.trim() || loading}
                  className="group mt-7 inline-flex w-full items-center justify-center gap-3 bg-[#B89367] px-5 py-4 text-base font-medium text-white shadow-lg shadow-[#B89367]/20 outline-none transition-all hover:bg-[#A07C58] focus-visible:ring-2 focus-visible:ring-[#B89367] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
                  style={{ borderRadius: 8, fontFamily: "var(--font-playfair), Georgia, serif" }}
                  whileHover={name.trim() && !loading ? { y: -2 } : undefined}
                  whileTap={name.trim() && !loading ? { scale: 0.98 } : undefined}
                  id="enter-memory-book-btn"
                >
                  {loading
                    ? mode === "edit"
                      ? "Đang lưu..."
                      : "Đang lưu kỷ niệm..."
                    : mode === "edit"
                    ? "Lưu thay đổi"
                    : "Bước vào kỷ yếu"}
                </motion.button>
              </div>
            </motion.section>
          </div>
        </motion.div>
      )}

      {step === "success" && (
        <motion.div
          key="success"
          className="fixed inset-0 z-50 overflow-hidden bg-[#15110E]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={screenTransition}
        >
          <Image
            src="/bg.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,12,10,0.94),rgba(27,24,21,0.82),rgba(15,12,10,0.96))]" />

          <div className="relative z-10 flex min-h-dvh items-center justify-center px-6">
            <motion.div
              className="max-w-md text-center"
              initial={{ opacity: 0, y: 26, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={panelSpring}
            >
              <motion.div
                className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-[#B89367]/55 bg-[#B89367]/15 text-[#D8C0A8] shadow-[0_18px_60px_rgba(184,147,103,0.18)]"
                animate={{ scale: [0.96, 1.04, 1], y: [0, -3, 0] }}
                transition={{ duration: 1.1, ease: smoothEase }}
              >
                <CheckCircle size={38} />
              </motion.div>
              <h2
                className="text-2xl leading-tight text-[#FFF8ED] md:text-3xl"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Ký ức của bạn đã được lưu giữ
              </h2>
              <p
                className="mt-3 text-sm leading-7 text-[#C4B5A8] md:text-base"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Đang mở kỷ yếu...
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
