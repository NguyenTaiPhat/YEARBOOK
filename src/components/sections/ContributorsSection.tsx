"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users } from "@/components/ui/Icons";

interface User {
  id: string;
  name: string;
  avatar_url: string | null;
  memory_message: string | null;
  created_at: string;
}

function Avatar({ user }: { user: User }) {
  const size = 64;

  if (user.avatar_url) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={user.avatar_url}
        alt={user.name}
        className="rounded-full object-cover w-full h-full"
      />
    );
  }

  // Fallback: two-letter initials
  const words = user.name.trim().split(/\s+/);
  const initials =
    words.length >= 2
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : user.name.slice(0, 2).toUpperCase();

  // Deterministic pastel-gold hue based on name length
  const hue = (user.name.length * 37) % 60 + 30; // 30-90 range → warm golds/ambers
  return (
    <div
      className="w-full h-full rounded-full flex items-center justify-center font-bold text-white select-none text-xl"
      style={{
        background: `radial-gradient(circle at 35% 35%, hsl(${hue},70%,65%), hsl(${hue},50%,38%))`,
        fontFamily: "var(--font-playfair), Georgia, serif",
        letterSpacing: "0.05em",
        fontSize: size * 0.3,
      }}
    >
      {initials}
    </div>
  );
}

function ContributorCard({ user, index }: { user: User; index: number }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 group"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative w-16 h-16 md:w-20 md:h-20 cursor-default"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
      >
        {/* Gold dashed ring */}
        <div className="absolute -inset-1.5 rounded-full border border-dashed border-[var(--soft-gold)] opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
        {/* Glow on hover */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-md bg-[var(--soft-gold)]" />
        <Avatar user={user} />
      </motion.div>

      <div className="text-center max-w-[100px]">
        <p
          className="text-[var(--text-primary)] font-semibold text-xs md:text-sm leading-tight truncate"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          title={user.name}
        >
          {user.name}
        </p>
        {user.memory_message && (
          <p
            className="text-[var(--text-secondary)] text-[10px] mt-0.5 leading-tight line-clamp-2 opacity-70"
            title={user.memory_message}
          >
            &ldquo;{user.memory_message}&rdquo;
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function ContributorsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="contributors-section"
      className="py-24 md:py-32 bg-[var(--bg-secondary)] relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--soft-gold)] opacity-[0.04] blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[var(--soft-gold)] text-sm font-medium tracking-widest uppercase mb-3">
            Đã ghé thăm kỷ yếu
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Contributors
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Mỗi khuôn mặt ở đây đã để lại một phần của mình trong cuốn kỷ yếu này.
            Cảm ơn bạn đã tham gia và lưu giữ lại những lời nhắn và kỷ niệm.
          </p>
        </motion.div>

        {/* Grid of users */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--soft-gold)] border-t-transparent animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <motion.div
            className="text-center py-16 opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
          >
            <Users size={48} className="mx-auto text-[var(--soft-gold)] mb-4 opacity-40" />
            <p
              className="text-[var(--text-secondary)] text-sm"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Chưa có ai ghé thăm... Hãy là người đầu tiên!
            </p>
          </motion.div>
        ) : (
          <>
            {/* User count badge */}
            <motion.div
              className="flex justify-center mb-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="glass px-5 py-2 rounded-full flex items-center gap-2.5">
                <Users size={15} className="text-[var(--soft-gold)]" />
                <span
                  className="text-[var(--text-primary)] text-sm font-semibold"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {users.length} người đã tham gia
                </span>
              </div>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {users.map((user, i) => (
                <ContributorCard key={user.id} user={user} index={i} />
              ))}
            </div>
          </>
        )}

        {/* Bottom divider */}
        <motion.div
          className="mt-20 flex items-center gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.35 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="flex-1 h-px bg-[var(--warm-sand)]" />
          <span
            className="text-[10px] tracking-[0.25em] uppercase text-[#8A7A6A]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            2023 – 2026
          </span>
          <div className="flex-1 h-px bg-[var(--warm-sand)]" />
        </motion.div>
      </div>
    </section>
  );
}
