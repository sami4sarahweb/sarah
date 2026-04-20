"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { GalleryCategory } from "./category-manager";
import { Video, Loader2, Link as LinkIcon } from "lucide-react";

export function AddYoutubeModal({
  categories,
  onSuccess,
}: {
  categories: GalleryCategory[];
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"youtube_wide" | "youtube_short">("youtube_wide");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [customThumb, setCustomThumb] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const supabase = createClient();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;
    setUploading(true);

    try {
      let finalThumbnailUrl = null;

      // 1. Upload Custom Thumbnail if provided
      if (customThumb) {
        const fileExt = customThumb.name.split(".").pop();
        const fileName = `thumb_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(fileName, customThumb);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(uploadData.path);
          
        finalThumbnailUrl = publicUrlData.publicUrl;
      }

      // 2. Insert into gallery_media
      const { error: dbError } = await supabase.from("gallery_media").insert({
        type,
        url,
        thumbnail_url: finalThumbnailUrl,
        title,
        description,
        category_id: categoryId || null,
      });

      if (dbError) throw dbError;

      // 3. Reset and Close
      setUrl("");
      setType("youtube_wide");
      setCustomThumb(null);
      setTitle("");
      setDescription("");
      setCategoryId("");
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error adding YouTube video:", error);
      alert("حدث خطأ أثناء الإضافة.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="secondary" className="gap-2">
          <Video className="h-4 w-4" />
          إضافة فيديو يوتيوب
        </Button>
      } />
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>إضافة فيديو يوتيوب</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="flex flex-col gap-4 mt-4">
          
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <span className="text-sm">نوع الفيديو</span>
              <Select value={type} onValueChange={(val) => { if(val) setType(val as "youtube_wide" | "youtube_short"); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube_wide">فيديو عرضي (Wide)</SelectItem>
                  <SelectItem value="youtube_short">فيديو طولي (Shorts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <span className="text-sm">التصنيف</span>
              <Select value={categoryId} onValueChange={(val) => setCategoryId(val || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر تصنيفاً..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm">رابط يوتيوب</span>
            <div className="relative">
              <LinkIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pr-9"
                placeholder="https://youtube.com/..." 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm">العنوان</span>
            <Input 
              placeholder="عنوان الفيديو..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm">صورة مصغرة مخصصة (اختياري)</span>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setCustomThumb(e.target.files?.[0] || null)}
            />
            <span className="text-xs text-muted-foreground">
              إذا لم يتم رفع صورة، سيتم محاولة استخدام غلاف الفيديو الافتراضي على المنصة.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm">الوصف (إختياري)</span>
            <Textarea 
              placeholder="وصف مختصر..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={uploading || !url || !title}>
            {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : "إضافة الفيديو"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
