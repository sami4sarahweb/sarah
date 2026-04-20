"use client";

import { useState } from "react";
import { Database } from "@/types/database.types";
import { GalleryCategory } from "./category-manager";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Trash2, Video, Image as ImageIcon } from "lucide-react";

export type GalleryMedia = Database['public']['Tables']['gallery_media']['Row'];

export function MediaGrid({
  items,
  categories,
  onDelete,
  onSelect,
  actionMode,
  filterPrimaryType = "all", // "image" | "video" | "all"
}: {
  items: GalleryMedia[];
  categories: GalleryCategory[];
  onDelete?: (id: string) => void;
  onSelect?: (item: GalleryMedia) => void;
  actionMode?: "delete" | "select" | "none";
  filterPrimaryType?: "image" | "video" | "all";
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVideoType, setSelectedVideoType] = useState<string>("all"); // all, youtube_wide, youtube_short

  // Filter Logic
  const filteredItems = items.filter((item) => {
    // 1. Primary Filter (Image vs Video)
    if (filterPrimaryType === "image" && item.type !== "image") return false;
    if (filterPrimaryType === "video" && !item.type.includes("youtube")) return false;

    // 2. Search Filter
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.description?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // 3. Category Filter
    if (selectedCategory !== "all" && item.category_id !== selectedCategory) {
      return false;
    }

    // 4. Video Sub-Type Filter
    if (filterPrimaryType === "video" || filterPrimaryType === "all") {
      if (selectedVideoType !== "all" && item.type !== selectedVideoType) {
        return false;
      }
    }

    return true;
  });

  const resolvedActionMode = onDelete ? "delete" : actionMode || "none";

  return (
    <div className="flex flex-col gap-4">
      {/* Filtering Header */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث في العنوان أو الوصف..."
            className="pr-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val || "all")}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="التصنيف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل التصنيفات</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(filterPrimaryType === "video" || filterPrimaryType === "all") && (
          <Select value={selectedVideoType} onValueChange={(val) => setSelectedVideoType(val || "all")}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="نوع الفيديو" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الفيديوهات</SelectItem>
              <SelectItem value="youtube_wide">عرضي (Wide)</SelectItem>
              <SelectItem value="youtube_short">طولي (Shorts)</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Grid Display */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-surface-container/30 rounded-xl border border-dashed border-border">
          <p>لا توجد وسائط تطابق بحثك.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const catName = categories.find(c => c.id === item.category_id)?.name || "غير مصنف";
            
            // Resolve YouTube thumbnail dynamically if none provided
            let displayImageUrl = item.thumbnail_url || item.url;
            if (item.type.includes("youtube") && !item.thumbnail_url) {
              // Extract video ID safely
              const extractYoutubeId = (url: string) => {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = url.match(regExp);
                return (match && match[2].length === 11) ? match[2] : null;
              };
              const vidId = extractYoutubeId(item.url);
              if (vidId) {
                displayImageUrl = `https://img.youtube.com/vi/${vidId}/maxresdefault.jpg`;
              }
            }

            return (
              <Card 
                key={item.id} 
                className={`overflow-hidden group glass-panel flex flex-col ${resolvedActionMode === 'select' ? 'cursor-pointer hover:border-primary transition-colors' : ''}`}
                onClick={() => {
                  if (resolvedActionMode === 'select' && onSelect) {
                    onSelect(item);
                  }
                }}
              >
                <div className="relative aspect-video bg-black/10 overflow-hidden">
                  {/* Aspect adjustments for 'short' videos visually in grid */}
                  <img 
                    src={displayImageUrl} 
                    alt={item.title} 
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${item.type === 'youtube_short' ? 'object-contain bg-black' : ''}`}
                    onError={(e) => {
                      // fallback if maxresdefault doesn't exist
                      if (displayImageUrl.includes("maxresdefault")) {
                        (e.target as HTMLImageElement).src = displayImageUrl.replace("maxresdefault", "hqdefault");
                      }
                    }}
                  />
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-md">
                      {item.type === 'image' ? <ImageIcon className="h-3 w-3 ml-1" /> : <Video className="h-3 w-3 ml-1" />}
                      {item.type === 'image' ? 'صورة' : item.type === 'youtube_short' ? 'Shorts' : 'يوتيوب'}
                    </Badge>
                  </div>

                  {/* Actions Overlay */}
                  {resolvedActionMode !== "none" && (
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {resolvedActionMode === "delete" && typeof onDelete === "function" && (
                        <Button 
                          variant="destructive" 
                          size="icon-sm" 
                          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                <CardContent className="p-3 flex-1 flex flex-col">
                  <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-xs text-muted-foreground">{catName}</span>
                    {item.type.includes('youtube') && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">مشاهدة</a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
