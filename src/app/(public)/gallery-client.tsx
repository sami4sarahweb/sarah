"use client";

import { useState, useRef } from "react";
import { FaIcon } from "@/components/ui/fa-icon";
import { faPlay, faXmark } from "@fortawesome/free-solid-svg-icons";
import type { HomeGalleryItem } from "@/lib/queries/home-data";
import { AnimatedSection } from "@/components/animations/animated-section";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface GalleryClientProps {
  items: HomeGalleryItem[];
}

function extractYoutubeId(url: string): string | null {
  // Handle shorts URLs
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return shortsMatch[1];
  // Handle standard URLs
  const standardMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/);
  return standardMatch ? standardMatch[1] : null;
}

export function GalleryClient({ items }: GalleryClientProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (activeVideo && modalRef.current && modalContentRef.current) {
      // Backdrop fade in
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      
      // Modal scale in
      gsap.fromTo(
        modalContentRef.current,
        { scale: 0.8, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)", delay: 0.1 }
      );
    }
  }, [activeVideo]);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => {
          // Calculate a staggered delay based on index (cap at 10 items to prevent huge delays)
          const staggerDelay = Math.min(index * 0.1, 1);

          if (item.type === "image") {
            return (
              <AnimatedSection key={item.id} animation="fade-up" delay={staggerDelay}>
                <div className="group relative rounded-xl overflow-hidden aspect-square bg-surface-container-high border border-border/30 hover-border-glow transition-colors h-full">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 end-3 start-3">
                      <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                      {item.category_name && (
                        <p className="text-white/70 text-xs">{item.category_name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          }

          // YouTube Video (wide or short)
          const videoId = extractYoutubeId(item.url);
          const thumbnailSrc = item.thumbnail_url || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "");
          const isShort = item.type === "youtube_short";

          return (
            <AnimatedSection 
              key={item.id} 
              animation="fade-up" 
              delay={staggerDelay}
              className={isShort ? "row-span-2" : "col-span-2"}
            >
              <div
                className={`group relative rounded-xl overflow-hidden bg-surface-container-high cursor-pointer border border-border/30 hover-border-glow transition-colors w-full h-full ${
                  isShort ? "aspect-[9/16]" : "aspect-video"
                }`}
                onClick={() => videoId && setActiveVideo(videoId)}
              >
                {thumbnailSrc && (
                  <img
                    src={thumbnailSrc}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-glow-sm group-hover:scale-110 transition-transform">
                    <FaIcon icon={faPlay} className="w-5 h-5 text-black ms-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 end-3 start-3">
                  <p className="text-white text-sm font-semibold truncate drop-shadow-lg">{item.title}</p>
                  {item.category_name && (
                    <p className="text-white/70 text-xs drop-shadow-lg">{item.category_name}</p>
                  )}
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>

      {/* Video Lightbox */}
      {activeVideo && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute top-6 end-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors duration-300 z-10 shadow-lg"
            aria-label="إغلاق"
          >
            <FaIcon icon={faXmark} className="w-6 h-6" />
          </button>
          
          <div
            ref={modalContentRef}
            className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(var(--primary),0.2)] border border-primary/20 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
              title="YouTube video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
