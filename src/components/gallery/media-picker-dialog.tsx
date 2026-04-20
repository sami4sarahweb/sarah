"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MediaGrid, GalleryMedia } from "./media-grid";
import { GalleryCategory } from "./category-manager";
import { ImagePlus, Video } from "lucide-react";
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
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const supabase = createClient();

  // Fetch only when opened once to avoid unnecessary network calls
  useEffect(() => {
    if (open && media.length === 0) {
      const load = async () => {
        const [mediaRes, catRes] = await Promise.all([
          supabase.from("gallery_media").select("*").order("created_at", { ascending: false }),
          supabase.from("gallery_categories").select("*").order("name")
        ]);
        if (mediaRes.data) setMedia(mediaRes.data);
        if (catRes.data) setCategories(catRes.data);
      };
      load();
    }
  }, [open]);

  const handleSelect = (item: GalleryMedia) => {
    onSelect(item);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <div className="mt-4">
          <MediaGrid 
            items={media} 
            categories={categories} 
            actionMode="select"
            onSelect={handleSelect}
            filterPrimaryType={filterPrimaryType}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
