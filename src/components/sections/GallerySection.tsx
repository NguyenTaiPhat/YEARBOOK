"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Download, ChevronLeft, ChevronRight, ZoomIn, Share2 } from "@/components/ui/Icons";
import { getVisitorId } from "@/lib/utils";

const IMAGE_ERROR_SRC =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E";

interface Photo {
  id: string;
  image_url: string;
  caption: string | null;
  heart_count: number;
}

function ImageCard({
  photo,
  onClick,
  onHeart,
  hearted,
  index,
}: {
  photo: Photo;
  onClick: () => void;
  onHeart: () => void;
  hearted: boolean;
  index: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.div
      className="group relative bg-[var(--bg-card)] rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-[var(--accent-beige)]">
        {!loaded && !error && (
          <div className="absolute inset-0 skeleton" />
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.image_url}
          alt={photo.caption || "Memory"}
          className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
            }`}
          loading="lazy"
          onLoad={() => {
            setLoaded(true);
            console.log('✅ Image loaded:', photo.id);
          }}
          onError={(e) => {
            console.error('❌ Image failed:', photo.id, photo.image_url);
            setError(true);
            const target = e.target as HTMLImageElement;
            target.src = IMAGE_ERROR_SRC;
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {photo.caption && (
              <p className="text-white text-sm font-medium line-clamp-2 mb-2">
                {photo.caption}
              </p>
            )}
          </div>
        </div>

        {/* Zoom Icon */}
        <div className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
          <ZoomIn size={18} className="text-[var(--text-primary)]" />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="p-3 flex items-center justify-between bg-white dark:bg-[var(--dark-card)]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onHeart();
          }}
          className={`flex items-center gap-2 transition-all ${hearted ? "text-red-500" : "text-[var(--text-secondary)] hover:text-red-500"
            }`}
          aria-label="Like"
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${hearted ? "scale-110 fill-current" : ""}`}
          />
          <span className="text-sm font-medium">{photo.heart_count}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({
                  title: photo.caption || 'Memory',
                  url: window.location.href,
                });
              }
            }}
            className="text-[var(--text-secondary)] hover:text-[var(--soft-gold)] transition-colors p-1"
            aria-label="Share"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[index];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {/* Navigation Buttons */}
      {photos.length > 1 && (
        <>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Image Container */}
      <div className="max-w-7xl max-h-[90vh] w-full px-4" onClick={(e) => e.stopPropagation()}>
        <motion.div
          key={photo.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.image_url}
            alt={photo.caption || ""}
            className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = IMAGE_ERROR_SRC;
            }}
          />

          {/* Info Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
            <div className="flex items-center justify-between text-white">
              <div className="flex-1">
                {photo.caption && (
                  <h3 className="text-lg font-semibold mb-1">{photo.caption}</h3>
                )}
                <p className="text-sm text-white/80">
                  {index + 1} / {photos.length}
                </p>
              </div>
              <a
                href={photo.image_url}
                download
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Download size={16} />
                <span className="text-sm font-medium">Download</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function GallerySection() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [heartedIds, setHeartedIds] = useState<Set<string>>(new Set());
  const visitorId = useRef(getVisitorId());
  const INITIAL_COUNT = 12;

  useEffect(() => {
    const stored = localStorage.getItem("yearbook_hearted");
    if (stored) setHeartedIds(new Set(JSON.parse(stored)));
  }, []);

  useEffect(() => {
    console.log('🖼️ GallerySection: Fetching photos...');
    fetch("/api/drive")
      .then((r) => r.json())
      .then((data) => {
        console.log('✅ API Response:', data);
        console.log('📊 Photos:', data.photos?.length || 0);
        if (data.photos && data.photos.length > 0) {
          console.log('🔗 Sample URL:', data.photos[0].image_url);
          setPhotos(data.photos);
        } else {
          setPhotos([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Fetch failed:', err);
        setPhotos([]);
        setLoading(false);
      });
  }, []);

  const handleHeart = useCallback(
    (photo: Photo) => {
      const already = heartedIds.has(photo.id);
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id
            ? { ...p, heart_count: p.heart_count + (already ? -1 : 1) }
            : p
        )
      );
      const next = new Set(heartedIds);
      if (already) next.delete(photo.id);
      else next.add(photo.id);
      setHeartedIds(next);
      localStorage.setItem("yearbook_hearted", JSON.stringify([...next]));

      fetch("/api/hearts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drive_file_id: photo.id,
          image_url: photo.image_url,
          caption: photo.caption,
          visitor_identifier: visitorId.current,
        }),
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.heart_count !== undefined) {
            setPhotos((prev) =>
              prev.map((p) =>
                p.id === photo.id ? { ...p, heart_count: res.heart_count } : p
              )
            );
          }
        })
        .catch((err) => console.error("Heart failed:", err));
    },
    [heartedIds]
  );

  return (
    <section id="gallery-section" className="py-20 md:py-32 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[var(--soft-gold)] text-sm font-semibold tracking-wider uppercase mb-4">
            Our Collection
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Memory Gallery
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Những khoảnh khắc đẹp nhất được lưu giữ mãi mãi
          </p>
        </motion.div>

        {/* Loading Grid */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="aspect-square skeleton rounded-lg" />
            ))}
          </div>
        )}

        {/* Photo Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {(showAll ? photos : photos.slice(0, INITIAL_COUNT)).map((photo, index) => (
                <ImageCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onClick={() => setLightboxIndex(index)}
                  onHeart={() => handleHeart(photo)}
                  hearted={heartedIds.has(photo.id)}
                />
              ))}
            </div>

            {/* Show more / collapse button */}
            {photos.length > INITIAL_COUNT && (
              <motion.div
                className="flex justify-center mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="group flex items-center gap-3 px-8 py-3 rounded-full border border-[var(--soft-gold)] border-opacity-40 text-[var(--text-secondary)] hover:text-[var(--soft-gold)] hover:border-opacity-80 transition-all duration-300"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  <span className="text-sm tracking-widest uppercase">
                    {showAll
                      ? "Thu gọn"
                      : `Xem thêm ${photos.length - INITIAL_COUNT} ảnh`}
                  </span>
                  <motion.span
                    animate={{ rotate: showAll ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[var(--soft-gold)] text-xs"
                  >
                    &#8964;
                  </motion.span>
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--text-secondary)] text-lg">
              No photos yet. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex((i) => (i! > 0 ? i! - 1 : photos.length - 1))}
            onNext={() => setLightboxIndex((i) => (i! < photos.length - 1 ? i! + 1 : 0))}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
