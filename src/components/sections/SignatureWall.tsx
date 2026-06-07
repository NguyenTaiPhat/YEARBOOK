"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { CheckCircle, PenLine, Send, X } from "@/components/ui/Icons";
import { SIGNATURE_COLORS, randomBetween, getVisitorId } from "@/lib/utils";

interface Signature {
  id: string;
  author_name: string;
  note: string | null;
  position_x: number;
  position_y: number;
  color: string;
  created_at: string;
  can_edit?: boolean;
}

const DEFAULT_SIGNATURE_COLOR = SIGNATURE_COLORS[0];
const isLocalOnlyId = (id: string) => id.startsWith("local-");

function stableHash(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function stableRange(seed: string, min: number, max: number) {
  const ratio = (stableHash(seed) % 1000) / 1000;
  return min + (max - min) * ratio;
}

function darkenHex(hex: string, amount = 0.82) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));
  return `#${[r, g, b]
    .map((channel) => clamp(channel * amount).toString(16).padStart(2, "0"))
    .join("")}`;
}

const DEMO_SIGNATURES: Signature[] = [
  { id: "1", author_name: "Tài Phát", note: "Ký tên cho tui ở đâyy", position_x: 8, position_y: 15, color: "#14842f", created_at: "" },
];

function SignatureItem({
  sig,
  index,
  isMobile,
  isEditing,
  isDark,
  densityScale,
  onEdit,
  onDelete,
  isDeleting,
}: {
  sig: Signature;
  index: number;
  isMobile: boolean;
  isEditing: boolean;
  isDark: boolean;
  densityScale: number;
  onEdit: (signature: Signature) => void;
  onDelete: (signature: Signature) => void;
  isDeleting: boolean;
}) {
  const { fontSize, tilt } = useMemo(() => {
    const baseSize = isMobile ? stableRange(`${sig.id}-font`, 13, 17) : stableRange(`${sig.id}-font`, 18, 26);
    const scaled = Math.max(isMobile ? 10 : 14, baseSize * densityScale);
    return {
      fontSize: scaled,
      tilt: stableRange(`${sig.id}-tilt`, -6, 6),
    };
  }, [sig.id, isMobile, densityScale]);

  const textColor = isDark ? darkenHex(sig.color, 0.82) : sig.color;

  return (
    <motion.div
      className="absolute group select-none signature-item"
      style={{ left: `${sig.position_x}%`, top: `${sig.position_y}%` }}
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, type: "spring", damping: 15 }}
      whileHover={{ scale: 1.1, zIndex: 20 }}
    >
      <div
        style={{ rotate: `${tilt}deg` }}
        className={`relative cursor-default max-w-[140px] rounded-md px-1 py-0.5 md:max-w-none ${
          isEditing ? "bg-[var(--soft-gold)]/10 ring-1 ring-[var(--soft-gold)]/35" : ""
        }`}
      >
        <p
          style={{
            fontFamily: "var(--font-handwriting), cursive",
            fontSize: `${fontSize}px`,
            fontWeight: 400,
            color: textColor,
            lineHeight: 1.3,
            textShadow: "0 1px 2px rgba(0,0,0,0.08)",
            whiteSpace: isMobile ? "normal" : "nowrap",
            wordBreak: isMobile ? "break-word" : "normal",
          }}
        >
          {sig.author_name}
        </p>
        {sig.note && (
          <p
            style={{
              fontFamily: "var(--font-handwriting), cursive",
              fontSize: `${fontSize * 0.75}px`,
              fontWeight: 400,
              color: textColor,
              opacity: 0.75,
              whiteSpace: isMobile ? "normal" : "nowrap",
              wordBreak: isMobile ? "break-word" : "normal",
              marginTop: "2px",
            }}
          >
            {sig.note}
          </p>
        )}
        {sig.can_edit && (
          <div className="absolute -right-9 -top-6 flex gap-1 opacity-100 md:group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onEdit(sig)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--soft-gold)] shadow-md ring-1 ring-[var(--border-warm)] transition-all hover:-translate-y-0.5 hover:bg-white"
              aria-label="Chỉnh sửa chữ ký"
            >
              <PenLine size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(sig)}
              disabled={isDeleting}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#C44E4E] shadow-md ring-1 ring-[#C44E4E]/20 transition-all hover:-translate-y-0.5 hover:bg-white disabled:opacity-50"
              aria-label="Xóa chữ ký"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function SignatureWall() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [color, setColor] = useState(DEFAULT_SIGNATURE_COLOR);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [editingSignatureId, setEditingSignatureId] = useState<string | null>(null);
  const [savingSignatureId, setSavingSignatureId] = useState<string | null>(null);
  const [deletingSignatureId, setDeletingSignatureId] = useState<string | null>(null);
  const [deleteConfirmSignatureId, setDeleteConfirmSignatureId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch real signatures on mount
  useEffect(() => {
    const visitorId = getVisitorId();

    fetch(`/api/signatures?visitor_identifier=${encodeURIComponent(visitorId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.signatures && data.signatures.length > 0) {
          setSignatures(data.signatures);

          const ownSignature = data.signatures.find(
            (signature: Signature) => signature.can_edit
          );

          if (ownSignature) {
            setEditingSignatureId(ownSignature.id);
            setName(ownSignature.author_name);
            setNote(ownSignature.note || "");
            setColor(ownSignature.color || DEFAULT_SIGNATURE_COLOR);
          }
        } else {
          setSignatures(DEMO_SIGNATURES);
        }
      })
      .catch(() => {
        setSignatures(DEMO_SIGNATURES);
      });
  }, []);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const boardBackground = isDark
    ? "linear-gradient(135deg, #F7E2A8 0%, #E5C16F 100%)"
    : "linear-gradient(135deg, #FFFEF8 0%, #FFF5E8 100%)";

  const densityScale = useMemo(() => {
    const count = signatures.length;
    if (count <= 10) return 1;
    return Math.max(0.6, 1 - Math.min(0.4, (count - 10) * 0.02));
  }, [signatures.length]);

  const pendingDeleteSignature = signatures.find((sig) => sig.id === deleteConfirmSignatureId) ?? null;

  const handleStartEdit = (signature: Signature) => {
    setEditingSignatureId(signature.id);
    setName(signature.author_name);
    setNote(signature.note || "");
    setColor(signature.color || DEFAULT_SIGNATURE_COLOR);
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const handleCancelEdit = () => {
    setEditingSignatureId(null);
    setSavingSignatureId(null);
    setName("");
    setNote("");
    setColor(DEFAULT_SIGNATURE_COLOR);
  };

  const handleDeleteSignature = (signature: Signature) => {
    setDeleteConfirmSignatureId(signature.id);
  };

  const handleCancelDeleteSignature = () => {
    setDeleteConfirmSignatureId(null);
  };

  const handleConfirmDeleteSignature = async () => {
    if (!deleteConfirmSignatureId) return;

    const signature = signatures.find((item) => item.id === deleteConfirmSignatureId);
    if (!signature) {
      setDeleteConfirmSignatureId(null);
      return;
    }

    const previousSignatures = [...signatures];
    setDeletingSignatureId(signature.id);
    setSignatures((prev) => prev.filter((item) => item.id !== signature.id));
    setEditingSignatureId((prev) => (prev === signature.id ? null : prev));
    setDeleteConfirmSignatureId(null);

    if (isLocalOnlyId(signature.id)) {
      setDeletingSignatureId(null);
      return;
    }

    try {
      const response = await fetch(
        `/api/signatures?id=${encodeURIComponent(signature.id)}&visitor_identifier=${encodeURIComponent(getVisitorId())}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete signature");
      }
    } catch (err) {
      console.error("Failed to delete signature:", err);
      setSignatures(previousSignatures);
    } finally {
      setDeletingSignatureId(null);
    }
  };

  const handleUpdateSignature = async () => {
    if (!editingSignatureId || !name.trim()) return;

    const previousSignature = signatures.find((signature) => signature.id === editingSignatureId);
    if (!previousSignature) return;

    const nextSignature: Signature = {
      ...previousSignature,
      author_name: name.trim(),
      note: note.trim() || null,
      color,
      can_edit: true,
    };

    setSavingSignatureId(editingSignatureId);
    setSignatures((prev) =>
      prev.map((signature) => (signature.id === editingSignatureId ? nextSignature : signature))
    );

    if (isLocalOnlyId(editingSignatureId)) {
      handleCancelEdit();
      return;
    }

    try {
      const response = await fetch("/api/signatures", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingSignatureId,
          author_name: nextSignature.author_name,
          note: nextSignature.note,
          color: nextSignature.color,
          visitor_identifier: getVisitorId(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update signature");
      }

      const data = await response.json();
      if (data.signature) {
        setSignatures((prev) =>
          prev.map((signature) =>
            signature.id === editingSignatureId
              ? { ...signature, ...data.signature, can_edit: true }
              : signature
          )
        );
      }
      handleCancelEdit();
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch (err) {
      setSignatures((prev) =>
        prev.map((signature) => (signature.id === editingSignatureId ? previousSignature : signature))
      );
      console.error("Failed to update signature:", err);
    } finally {
      setSavingSignatureId(null);
    }
  };

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSignatureId) {
      await handleUpdateSignature();
      return;
    }

    if (!name.trim()) return;
    setSubmitting(true);

    const visitorId = getVisitorId();
    const localId = `local-${Date.now()}`;

    const newSig: Signature = {
      id: localId,
      author_name: name.trim(),
      note: note.trim() || null,
      // Adjust position ranges for mobile to avoid overlap
      position_x: isMobile ? randomBetween(5, 70) : randomBetween(5, 80),
      position_y: isMobile ? randomBetween(5, 75) : randomBetween(5, 80),
      color,
      created_at: new Date().toISOString(),
      can_edit: true,
    };

    // Optimistic update
    setSignatures((prev) => [...prev, newSig]);
    setName("");
    setNote("");
    setDone(true);
    setTimeout(() => setDone(false), 3000);

    // Save to Supabase
    try {
      const response = await fetch("/api/signatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: newSig.author_name,
          note: newSig.note,
          position_x: newSig.position_x,
          position_y: newSig.position_y,
          color: newSig.color,
          visitor_identifier: visitorId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.signature) {
          setSignatures((prev) =>
            prev.map((signature) =>
              signature.id === localId
                ? { ...signature, ...data.signature, can_edit: true }
                : signature
            )
          );
        }
      }
    } catch (err) {
      console.error("Failed to save signature to Supabase:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="signature-wall" className="py-24 md:py-32 bg-[var(--bg-main)]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[var(--soft-gold)] text-sm font-medium tracking-widest uppercase mb-3">
            Ký tên lên đây.
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Sign Your Name
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Hãy để lại chữ ký của bạn ở đây nhee.
          </p>
        </motion.div>

        {/* Signature board */}
        {deleteConfirmSignatureId && (
          <div className="mb-6 rounded-2xl border border-[#C44E4E] bg-[#FFEAEA] p-5 text-sm text-[#5A1C1C] shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-[15px]">Xác nhận xóa chữ ký</p>
                <p className="text-[13px] text-[#6E2A2A] mt-1">
                  Bạn sắp xóa chữ ký của <span className="font-semibold text-[#3B3028]">{pendingDeleteSignature?.author_name ?? "bạn"}</span>. Hành động này sẽ xóa vĩnh viễn khỏi tường.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCancelDeleteSignature}
                  className="rounded-full border border-[#C44E4E] bg-white px-4 py-2 text-sm font-semibold text-[#5A1C1C] transition hover:bg-[#FBE5E5]"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteSignature}
                  disabled={deletingSignatureId === deleteConfirmSignatureId}
                  className="rounded-full bg-[#C44E4E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#A11E1E] disabled:opacity-50"
                >
                  {deletingSignatureId === deleteConfirmSignatureId ? "Đang xóa..." : "Xóa ngay"}
                </button>
              </div>
            </div>
          </div>
        )}
        <motion.div
          className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden mb-8 md:mb-10 paper-texture"
          style={{
            height: "clamp(300px, 60vw, 450px)",
            background: boardBackground,
            boxShadow: isDark
              ? "0 10px 40px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(184,147,103,0.22)"
              : "0 10px 40px rgba(59,48,40,0.1), inset 0 0 0 1px rgba(184,147,103,0.15)",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >

          {/* Grid lines like ruled paper */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="absolute w-full h-px bg-[var(--soft-gold)]" style={{ top: `${(i + 1) * 10}%` }} />
            ))}
          </div>

          {/* Watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(40px, 12vw, 80px)",
              color: "var(--soft-gold)",
              fontStyle: "italic",
            }}
          >
            12A19
          </div>

          {/* Signatures */}
          {signatures.map((sig, i) => (
            <SignatureItem
              key={sig.id}
              sig={sig}
              index={i}
              isMobile={isMobile}
              isDark={isDark}
              densityScale={densityScale}
              isEditing={editingSignatureId === sig.id}
              isDeleting={deletingSignatureId === sig.id}
              onEdit={handleStartEdit}
              onDelete={handleDeleteSignature}
            />
          ))}
        </motion.div>

        {/* Form */}
        <motion.form
          ref={formRef}
          onSubmit={handleSign}
          className="max-w-xl mx-auto glass rounded-xl md:rounded-2xl p-5 md:p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4 md:mb-5">
            <PenLine size={18} className="text-[var(--soft-gold)]" />
            <h3 className="text-[var(--text-primary)] font-semibold text-base md:text-lg">
              {editingSignatureId ? "Chỉnh sửa chữ ký" : "Ký tên của bạn"}
            </h3>
          </div>

          <div className="space-y-3 md:space-y-4 mb-4 md:mb-5">
            <div className="w-full">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên của bạn..."
                maxLength={30}
                required
                className="w-full px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-[var(--border-warm)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--warm-sand)] focus:outline-none focus:border-[var(--soft-gold)] transition-colors text-base"
                id="signature-name-input"
              />
            </div>

            <div className="w-full">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Lời nhắn ngắn (không bắt buộc)..."
                maxLength={40}
                className="w-full px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-[var(--border-warm)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--warm-sand)] focus:outline-none focus:border-[var(--soft-gold)] transition-colors text-sm md:text-base"
                id="signature-note-input"
              />
            </div>
          </div>

          {/* Color picker */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 md:mb-5">
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wide font-medium">Màu mực:</span>
            <div className="flex gap-2 flex-wrap">
              {SIGNATURE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 md:w-9 md:h-9 rounded-full transition-all border-2 ${color === c
                    ? "scale-110 border-[var(--soft-gold)] shadow-md"
                    : "border-transparent hover:scale-105 hover:border-[var(--border-warm)]"
                    }`}
                  style={{ background: c }}
                  aria-label={`Màu ${c}`}
                />
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={submitting || Boolean(savingSignatureId) || !name.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 md:py-3.5 rounded-lg md:rounded-xl bg-[var(--soft-gold)] text-white font-semibold text-sm md:text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#A07C58] active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
            whileTap={{ scale: 0.97 }}
            id="signature-submit-btn"
          >
            {editingSignatureId ? <CheckCircle size={16} /> : <Send size={16} />}
            {editingSignatureId
              ? savingSignatureId ? "Đang lưu..." : "Lưu Chỉnh Sửa"
              : done ? "Đã ký tên!" : submitting ? "Đang xử lý..." : "Ký Tên Lên Tường"}
          </motion.button>
          {editingSignatureId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={Boolean(savingSignatureId)}
              className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-50"
            >
              <X size={15} />
              Hủy chỉnh sửa
            </button>
          )}
        </motion.form>
      </div>
    </section>
  );
}
