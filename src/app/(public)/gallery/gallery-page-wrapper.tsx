"use client";

import { useState } from "react";
import { type HomeGalleryItem } from "@/lib/queries/home-data";
import { AnimatedSection } from "@/components/animations/animated-section";
import { GalleryClient } from "../gallery-client";

interface Category {
  id: string;
  name: string;
  slug?: string | null;
}

interface GalleryPageWrapperProps {
  media: (HomeGalleryItem & { category_id?: string | null })[];
  categories: Category[];
}

export function GalleryPageWrapper({ media, categories }: GalleryPageWrapperProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");

  const filteredMedia = activeCategoryId === "all" 
    ? media 
    : media.filter(m => m.category_id === activeCategoryId);

  return (
    <div className="w-full relative z-10 flex flex-col gap-10">
      
      {/* Filters (Scrollable Mobile, Centered Desktop) */}
      <AnimatedSection animation="fade-up" delay={0.4}>
        <div className="flex w-full overflow-x-auto custom-scrollbar pb-4 md:pb-0 md:justify-center">
          <div className="flex items-center gap-2 p-1.5 glass-panel rounded-full border border-border/30 shadow-glow-sm min-w-max">
            
            <button
              onClick={() => setActiveCategoryId("all")}
              className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategoryId === "all"
                  ? "text-black shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-container"
              }`}
            >
              {activeCategoryId === "all" && (
                <div className="absolute inset-0 bg-primary rounded-full custom-layout-id" style={{ zIndex: -1 }} />
              )}
              الكل
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategoryId === cat.id
                    ? "text-black shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-container"
                }`}
              >
                {activeCategoryId === cat.id && (
                   <div className="absolute inset-0 bg-primary rounded-full custom-layout-id" style={{ zIndex: -1 }} />
                )}
                {cat.name}
              </button>
            ))}

          </div>
        </div>
      </AnimatedSection>

      {/* Grid */}
      <div className="min-h-[500px]">
        {filteredMedia.length > 0 ? (
          <GalleryClient 
            // Key change forces GalleryClient to unmount/remount, triggering the stagger effect
            key={activeCategoryId} 
            items={filteredMedia} 
          />
        ) : (
          <AnimatedSection animation="fade-up" className="flex flex-col items-center justify-center h-64 text-center glass-panel rounded-3xl border border-border/30 border-dashed">
            <h3 className="text-xl font-bold mb-2">لا توجد وسائط</h3>
            <p className="text-muted-foreground">عفواً، لم يتم إضافة أي صور أو فيديوهات لهذا القسم بعد.</p>
          </AnimatedSection>
        )}
      </div>

    </div>
  );
}
