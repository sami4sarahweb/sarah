"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MediaGrid, GalleryMedia } from "./media-grid";
import { GalleryCategory } from "./category-manager";
import { UploadForm } from "./upload-image-modal";
import { ImagePlus, Video, FolderOpen, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MediaPickerDialog({
  onSelect,
  filterPrimaryType = "all",
  triggerButton,
  title = "اختر من المعرض"
}: {
  onSelect: (item: GalleryMedia) => void;
  filterPrimaryType?: "image" | "video" | "all";
  triggerButton?: React.ReactElement;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"browse" | "upload">("browse");
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();

  const loadMedia = async () => {
    const [mediaRes, catRes] = await Promise.all([
      supabase.from("gallery_media").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery_categories").select("*").order("name"),
    ]);
    if (mediaRes.data) setMedia(mediaRes.data);
    if (catRes.data) setCategories(catRes.data);
    setLoaded(true);
  };

  useEffect(() => {
    if (open && !loaded) {
      loadMedia();
    }
  }, [open]);

  const handleSelect = (item: GalleryMedia) => {
    onSelect(item);
    setOpen(false);
  };

  const handleUploadSuccess = (items: GalleryMedia[]) => {
    // Auto-select the first uploaded item
    if (items.length === 1) {
      onSelect(items[0]);
      setOpen(false);
    } else if (items.length > 0) {
      // Multiple items uploaded — refresh browse tab and switch to it
      // so user can pick which one they want
      setMedia((prev) => [...items, ...prev]);
      setTab("browse");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) setTab("browse"); }}>
      <DialogTrigger render={
        triggerButton || (
          <Button variant="outline" className="gap-2">
            {filterPrimaryType === 'video' ? <Video className="w-4 h-4" /> : <ImagePlus className="w-4 h-4" />}
            {title}
          </Button>
        )
      } />

      <DialogContent className="max-w-5xl glass-panel max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-2 p-1 bg-surface-container rounded-xl border border-border/30 w-fit">
          <button
            onClick={() => setTab("browse")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "browse"
                ? "bg-primary text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            تصفح المعرض
          </button>
          <button
            onClick={() => setTab("upload")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "upload"
                ? "bg-primary text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload className="w-4 h-4" />
            رفع جديد
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {tab === "browse" ? (
            <MediaGrid
              items={media}
              categories={categories}
              actionMode="select"
              onSelect={handleSelect}
              filterPrimaryType={filterPrimaryType}
            />
          ) : (
            <UploadForm
              categories={categories}
              onSuccess={handleUploadSuccess}
              compact
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
