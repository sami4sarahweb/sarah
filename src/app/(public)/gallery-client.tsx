"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import type { HomeGalleryItem } from "@/lib/queries/home-data";

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

  const images = items.filter((i) => i.type === "image");
  const videos = items.filter((i) => i.type === "youtube_wide" || i.type === "youtube_short");

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          if (item.type === "image") {
            return (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden aspect-square bg-surface-container-high"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 right-3 left-3">
                    <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                    {item.category_name && (
                      <p className="text-white/70 text-xs">{item.category_name}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // YouTube Video (wide or short)
          const videoId = extractYoutubeId(item.url);
          const thumbnailSrc = item.thumbnail_url || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "");
          const isShort = item.type === "youtube_short";

          return (
            <div
              key={item.id}
              className={`group relative rounded-xl overflow-hidden bg-surface-container-high cursor-pointer ${
                isShort ? "aspect-[9/16] row-span-2" : "aspect-video col-span-2"
              }`}
              onClick={() => videoId && setActiveVideo(videoId)}
            >
              {thumbnailSrc && (
                <img
                  src={thumbnailSrc}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.5)] group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-black fill-black mr-[-2px]" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 left-3">
                <p className="text-white text-sm font-semibold truncate drop-shadow-lg">{item.title}</p>
                {item.category_name && (
                  <p className="text-white/70 text-xs drop-shadow-lg">{item.category_name}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Lightbox */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
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
