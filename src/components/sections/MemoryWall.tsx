"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, PenLine, Send, MessageSquareHeart, X } from "@/components/ui/Icons";
import { STICKY_COLORS, getVisitorId, getStoredProfile } from "@/lib/utils";

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

interface Message {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
  avatar_url?: string | null;
  can_edit?: boolean;
}

const isLocalOnlyId = (id: string) => id.startsWith("local-");

const DEMO_MESSAGES: Message[] = [
  { id: "1", author_name: "Tài Phát", content: "Để lại lời nhắn cho tui ở đâyyy", created_at: new Date().toISOString(), avatar_url: null },
];

function MessageAvatar({ avatarUrl, authorName }: { avatarUrl?: string | null; authorName: string }) {
  const [failed, setFailed] = useState(false);

  if (!avatarUrl || failed) {
    return (
      <span
        className="w-6 h-6 flex-shrink-0"
        aria-hidden="true"
      />
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={avatarUrl}
      alt={authorName}
      className="w-6 h-6 rounded-full object-cover border border-[#B89367] flex-shrink-0"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function StickyNote({
  message,
  index,
  isEditing,
  editContent,
  isSaving,
  isDeleting,
  onEdit,
  onDelete,
  onEditContentChange,
  onCancelEdit,
  onSaveEdit,
}: {
  message: Message;
  index: number;
  isEditing: boolean;
  editContent: string;
  isSaving: boolean;
  isDeleting: boolean;
  onEdit: (message: Message) => void;
  onDelete: (message: Message) => void;
  onEditContentChange: (content: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (message: Message) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const color = STICKY_COLORS[index % STICKY_COLORS.length];
  const rotation = ((index * 7) % 9) - 4;
  const previewLength = 150;
  const isLong = message.content.length > previewLength;
  const displayContent = expanded || !isLong ? message.content : `${message.content.slice(0, previewLength)}...`;

  return (
    <motion.div
      className="sticky-note rounded-sm p-4 break-words"
      style={{
        background: color.bg,
        borderTop: `3px solid ${color.border}`,
        rotate: rotation,
      }}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06, type: "spring", damping: 18 }}
      whileHover={{ rotate: 0, scale: 1.02, zIndex: 10 }}
    >
      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editContent}
            onChange={(event) => onEditContentChange(event.target.value)}
            maxLength={1000}
            rows={4}
            className="w-full resize-none rounded-md border border-[#B89367]/35 bg-white/55 p-2 text-[#3B3028] outline-none focus:border-[#B89367]"
            style={{ fontFamily: "var(--font-handwriting), cursive", fontSize: "clamp(15px, 1.8vw, 17px)", lineHeight: 1.7 }}
            autoFocus
          />
          <div className="mt-1 text-right text-[10px] text-[#7B6A5A]">{editContent.length}/1000</div>
        </div>
      ) : (
        <>
          <p
            className="text-[#3B3028] leading-relaxed mb-3 overflow-hidden text-ellipsis"
            style={{ fontFamily: "var(--font-handwriting), cursive", fontSize: "clamp(15px, 1.8vw, 17px)", lineHeight: 1.7, maxHeight: expanded ? undefined : "8.5rem" }}
          >
            {displayContent}
          </p>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#7B6A5A] transition-colors hover:text-[#3B3028]"
          >
            {expanded ? "Thu gọn" : "Xem note"}
          </button>
        </>
      )}
      <div className="flex items-center justify-between border-t border-[#3b3028] border-opacity-10 pt-3 mt-2">
        <div className="flex items-center gap-2 max-w-[70%]">
          <MessageAvatar avatarUrl={message.avatar_url} authorName={message.author_name} />
          <span
            className="text-[#7B6A5A] font-semibold text-xs truncate"
            style={{ fontFamily: "var(--font-handwriting), cursive", fontSize: "14px" }}
          >
            — {message.author_name}
          </span>
        </div>
        <span className="text-[#B89367] text-[10px] opacity-70 whitespace-nowrap">
          {formatDateTime(message.created_at)}
        </span>
      </div>
      {message.can_edit && (
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={onCancelEdit}
                disabled={isSaving}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#3B3028]/10 text-[#7B6A5A] transition-colors hover:bg-[#3B3028]/15 disabled:opacity-50"
                aria-label="Hủy chỉnh sửa"
              >
                <X size={14} />
              </button>
              <button
                type="button"
                onClick={() => onSaveEdit(message)}
                disabled={isSaving || !editContent.trim()}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#B89367] text-white transition-colors hover:bg-[#A07C58] disabled:opacity-45"
                aria-label="Lưu chỉnh sửa"
              >
                <CheckCircle size={15} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onEdit(message)}
                className="inline-flex items-center gap-1 rounded-full bg-[#3B3028]/10 px-3 py-1.5 text-[11px] font-semibold text-[#7B6A5A] transition-colors hover:bg-[#3B3028]/15"
              >
                <PenLine size={12} />
                Sửa
              </button>
              <button
                type="button"
                onClick={() => onDelete(message)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 rounded-full bg-[#B89367]/10 px-3 py-1.5 text-[11px] font-semibold text-[#B89367] transition-colors hover:bg-[#B89367]/15 disabled:opacity-50"
              >
                Xóa
              </button>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function MemoryWall() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [savingMessageId, setSavingMessageId] = useState<string | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [deleteConfirmMessageId, setDeleteConfirmMessageId] = useState<string | null>(null);
  const [visibleNotes, setVisibleNotes] = useState(6);
  const titleRef = useRef(null);

  // Fetch real messages on load
  useEffect(() => {
    const visitorId = getVisitorId();

    fetch(`/api/messages?visitor_identifier=${encodeURIComponent(visitorId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages(DEMO_MESSAGES);
        }
      })
      .catch(() => {
        setMessages(DEMO_MESSAGES);
      });
  }, []);

  useEffect(() => {
    const storedProfile = getStoredProfile();
    if (storedProfile?.name) {
      setName(storedProfile.name);
    }
  }, []);

  const hasOwnNote = messages.some((msg) => msg.can_edit);
  const pendingDeleteMessage = messages.find((msg) => msg.id === deleteConfirmMessageId) ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim() || hasOwnNote) return;
    setSubmitting(true);

    const visitorId = getVisitorId();
    const storedProfile = getStoredProfile();
    const localAvatarUrl = storedProfile ? storedProfile.avatar_url : null;
    const localId = `local-${Date.now()}`;

    const newMsg: Message = {
      id: localId,
      author_name: name.trim(),
      content: content.trim(),
      created_at: new Date().toISOString(),
      avatar_url: localAvatarUrl,
      can_edit: true,
    };

    // Optimistic update
    setMessages((prev) => [newMsg, ...prev]);
    setName("");
    setContent("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);

    // Save to Supabase
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: newMsg.author_name,
          content: newMsg.content,
          visitor_identifier: visitorId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === localId
                ? { ...message, ...data.message, can_edit: true }
                : message
            )
          );
        }
      }
    } catch (err) {
      console.error("Failed to save memory to Supabase:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (message: Message) => {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  const handleDelete = (message: Message) => {
    setDeleteConfirmMessageId(message.id);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmMessageId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmMessageId) return;

    const message = messages.find((item) => item.id === deleteConfirmMessageId);
    if (!message) {
      setDeleteConfirmMessageId(null);
      return;
    }

    const previousMessages = messages;
    setDeletingMessageId(message.id);
    setMessages((prev) => prev.filter((item) => item.id !== message.id));
    setEditingMessageId((prev) => (prev === message.id ? null : prev));
    setDeleteConfirmMessageId(null);

    if (isLocalOnlyId(message.id)) {
      setDeletingMessageId(null);
      return;
    }

    try {
      const response = await fetch(
        `/api/messages?id=${encodeURIComponent(message.id)}&visitor_identifier=${encodeURIComponent(getVisitorId())}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
      setMessages(previousMessages);
    } finally {
      setDeletingMessageId(null);
    }
  };

  const handleSaveEdit = async (message: Message) => {
    const nextContent = editingContent.trim();
    if (!nextContent) return;

    const previousContent = message.content;
    setSavingMessageId(message.id);
    setMessages((prev) =>
      prev.map((item) => (item.id === message.id ? { ...item, content: nextContent } : item))
    );

    if (isLocalOnlyId(message.id)) {
      handleCancelEdit();
      setSavingMessageId(null);
      return;
    }

    try {
      const response = await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: message.id,
          content: nextContent,
          visitor_identifier: getVisitorId(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update message");
      }

      const data = await response.json();
      if (data.message) {
        setMessages((prev) =>
          prev.map((item) =>
            item.id === message.id ? { ...item, ...data.message, can_edit: true } : item
          )
        );
      }
      handleCancelEdit();
    } catch (err) {
      setMessages((prev) =>
        prev.map((item) => (item.id === message.id ? { ...item, content: previousContent } : item))
      );
      console.error("Failed to update memory:", err);
    } finally {
      setSavingMessageId(null);
    }
  };

  return (
    <section id="memory-wall" className="py-24 md:py-32 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={titleRef}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[var(--soft-gold)] text-sm font-medium tracking-widest uppercase mb-3">
            Gửi lời yêu thương
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Write Your Note
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Hãy để lại những dòng tâm sự và những điều muốn gửi đến tui ở đây.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mb-16 glass rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[var(--soft-gold)] bg-opacity-20 flex items-center justify-center">
              <MessageSquareHeart size={16} className="text-[var(--soft-gold)]" />
            </div>
            <h3 className="text-[var(--text-primary)] font-medium">Viết lời nhắn của bạn</h3>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide font-medium">
              Tên của bạn
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên của bạn..."
              maxLength={50}
              required
              disabled={hasOwnNote}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--warm-sand)] focus:outline-none focus:border-[var(--soft-gold)] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
              id="memory-wall-name"
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide font-medium">
              Lời nhắn của bạn
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Hãy nói điều bạn muốn chúng ta nhớ mãi mãi..."
              maxLength={1000}
              rows={3}
              required
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-warm)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--warm-sand)] focus:outline-none focus:border-[var(--soft-gold)] transition-colors resize-none"
              style={{ fontFamily: "var(--font-handwriting), cursive", fontSize: "clamp(16px, 2vw, 18px)" }}
              id="memory-wall-content"
            />
            <div className="text-right text-xs text-[var(--text-secondary)] mt-1">{content.length}/1000</div>
          </div>

          <motion.button
            type="submit"
            disabled={submitting || !name.trim() || !content.trim() || hasOwnNote}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--soft-gold)] text-white font-medium disabled:opacity-40 hover:bg-[#A07C58] transition-colors"
            whileTap={name.trim() && content.trim() && !hasOwnNote ? { scale: 0.97 } : {}}
            id="memory-wall-submit"
          >
            <Send size={16} />
            {hasOwnNote ? "Bạn đã gửi note rồi" : submitting ? "Đang gửi..." : submitted ? "Đã gửi!" : "Gửi Lời Nhắn"}
          </motion.button>
          {hasOwnNote && (
            <div className="mt-4 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-card)] p-4 text-sm text-[var(--text-secondary)]">
              Bạn chỉ được đăng 1 note. Nếu cần chỉnh sửa, hãy dùng nút Sửa trên note của bạn.
            </div>
          )}
        </motion.form>

        {/* Messages masonry */}
        {deleteConfirmMessageId && (
          <div className="mb-6 rounded-2xl border border-[#B89367] bg-[#FFF5D6] p-5 text-sm text-[#3B3028] shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-[15px]">Xác nhận xóa note</p>
                <p className="text-[13px] text-[#5D4B37] mt-1">
                  Bạn sắp xóa note của <span className="font-semibold text-[#3B3028]">{pendingDeleteMessage?.author_name ?? "người dùng"}</span>. Hành động này sẽ xóa note vĩnh viễn khỏi bảng.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="rounded-full border border-[#B89367] bg-white px-4 py-2 text-sm font-semibold text-[#3B3028] transition hover:bg-[#F7E3B3]"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deletingMessageId === deleteConfirmMessageId}
                  className="rounded-full bg-[#B89367] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#A07C58] disabled:opacity-50"
                >
                  {deletingMessageId === deleteConfirmMessageId ? "Đang xóa..." : "Xóa ngay"}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          <AnimatePresence>
            {messages.slice(0, visibleNotes).map((msg, i) => (
              <div key={msg.id} className="break-inside-avoid">
                <StickyNote
                  message={msg}
                  index={i}
                  isEditing={editingMessageId === msg.id}
                  editContent={editingMessageId === msg.id ? editingContent : ""}
                  isSaving={savingMessageId === msg.id}
                  isDeleting={deletingMessageId === msg.id}
                  onEdit={handleStartEdit}
                  onDelete={handleDelete}
                  onEditContentChange={setEditingContent}
                  onCancelEdit={handleCancelEdit}
                  onSaveEdit={handleSaveEdit}
                />
              </div>
            ))}
          </AnimatePresence>
          {messages.length > visibleNotes && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setVisibleNotes((prev) => prev + 6)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-warm)] bg-[var(--bg-card)] px-5 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--soft-gold)] hover:text-[var(--soft-gold)]"
              >
                Xem thêm {Math.min(messages.length - visibleNotes, 6)} note
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
