"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, MessageSquare, PenLine, Heart, Users } from "@/components/ui/Icons";

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  description: string;
}

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ stat, index, started }: { stat: StatItem; index: number; started: boolean }) {
  const count = useCountUp(stat.value, 2000 + index * 200, started);
  return (
    <motion.div
      className="glass rounded-3xl p-8 text-center group hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[var(--soft-gold)] bg-opacity-15 flex items-center justify-center group-hover:bg-opacity-25 transition-colors">
        <div className="text-[var(--soft-gold)]">{stat.icon}</div>
      </div>
      <div
        className="text-5xl md:text-6xl font-bold mb-2 text-gradient"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-[var(--text-primary)] font-semibold mb-1">{stat.label}</div>
      <div className="text-[var(--text-secondary)] text-sm">{stat.description}</div>
    </motion.div>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [stats, setStats] = useState({
    totalPhotos: 48,
    totalMessages: 127,
    totalSignatures: 89,
    totalHearts: 312,
    totalVisitors: 243,
  });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const STATS: StatItem[] = [
    { icon: <Camera size={24} />, label: "Tấm Ảnh", value: stats.totalPhotos, description: "Khoảnh khắc được ghi lại" },
    { icon: <MessageSquare size={24} />, label: "Lời Nhắn", value: stats.totalMessages, description: "Từ trái tim đến trái tim" },
    { icon: <PenLine size={24} />, label: "Chữ Ký", value: stats.totalSignatures, description: "Dấu ấn còn mãi" },
    { icon: <Heart size={24} />, label: "Trái Tim", value: stats.totalHearts, description: "Yêu thương được gửi đi" },
    { icon: <Users size={24} />, label: "Lượt Ghé Thăm", value: stats.totalVisitors, description: "Người đã mở kỷ yếu này" },
  ];

  return (
    <section id="stats-section" className="py-24 md:py-32 bg-[var(--bg-secondary)] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[var(--soft-gold)] opacity-5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[var(--soft-gold)] text-sm font-medium tracking-widest uppercase mb-3">
            Con số của chúng ta
          </p>
          <h2
            className="text-4xl md:text-5xl text-[var(--text-primary)] mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Những Gì Chúng Ta Đã Tạo Ra
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Mỗi con số là một câu chuyện, một kỷ niệm, một dấu ấn của lớp 12A19.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} started={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
