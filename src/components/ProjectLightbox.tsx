"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ProjectLightboxProps {
  images: GalleryImage[];
  className?: string;
}

export default function ProjectLightbox({ images, className = "" }: ProjectLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isOpen = selectedIndex !== null;

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose, handlePrev, handleNext]);

  if (images.length === 0) return null;

  return (
    <>
      {/* ─── GALLERY THUMBNAIL GRID ───────────────────────────────────────── */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
        {images.map((img, i) => (
          <div
            key={img.src + i}
            onClick={() => setSelectedIndex(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedIndex(i);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Open fullscreen view of ${img.alt || `gallery image ${i + 1}`}`}
            className="group relative h-60 sm:h-72 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0f18] hover:border-violet-500/40 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <Image
              src={img.src}
              alt={img.alt || `Gallery showcase ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-none">
              <div className="self-end p-2 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/10">
                <Maximize2 className="w-4 h-4 text-violet-300" />
              </div>
              {img.caption && (
                <div className="p-2.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono text-white/90">
                  {img.caption}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ─── FULLSCREEN ACCESSIBLE LIGHTBOX MODAL ─────────────────────────── */}
      {isOpen && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Top Bar: Counter & Close button */}
          <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 flex items-center justify-between z-10 font-mono text-xs text-white/60">
            <span className="bg-[#121622] px-3 py-1.5 rounded-lg border border-white/10">
              {selectedIndex + 1} / {images.length}
            </span>

            <button
              type="button"
              onClick={handleClose}
              className="p-2.5 rounded-xl bg-[#121622] hover:bg-[#181e2e] text-white border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400"
              aria-label="Close fullscreen image viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Previous / Next Controls */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 sm:left-8 p-3 rounded-2xl bg-[#121622]/80 hover:bg-[#181e2e] text-white border border-white/10 transition-all z-10 hidden sm:flex items-center justify-center"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 sm:right-8 p-3 rounded-2xl bg-[#121622]/80 hover:bg-[#181e2e] text-white border border-white/10 transition-all z-10 hidden sm:flex items-center justify-center"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Active Image Container */}
          <div className="relative w-full max-w-5xl h-[65vh] sm:h-[75vh] flex items-center justify-center">
            <Image
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt || `Project showcase ${selectedIndex + 1}`}
              fill
              className="object-contain rounded-xl"
              priority
              sizes="100vw"
            />
          </div>

          {/* Caption / Note */}
          {images[selectedIndex].caption && (
            <div className="mt-4 max-w-2xl text-center px-4 py-2 rounded-xl bg-[#121622] border border-white/10 text-xs font-mono text-white/80">
              {images[selectedIndex].caption}
            </div>
          )}
        </div>
      )}
    </>
  );
}
