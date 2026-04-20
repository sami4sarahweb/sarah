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
import { ImagePlus, Loader2 } from "lucide-react";

export function UploadImageModal({
  categories,
  onSuccess,
}: {
  categories: GalleryCategory[];
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const supabase = createClient();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;
    setUploading(true);

    try {
      // 1. Upload to Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(uploadData.path);

      // 2. Insert into gallery_media
      const { error: dbError } = await supabase.from("gallery_media").insert({
        type: "image",
        url: publicUrlData.publicUrl,
        title,
        description,
        category_id: categoryId || null,
      });

      if (dbError) throw dbError;

      // 3. Reset and Close
      setFile(null);
      setTitle("");
      setDescription("");
      setCategoryId("");
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("حدث خطأ أثناء الرفع.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="gap-2">
          <ImagePlus className="h-4 w-4" />
          رفع صورة
        </Button>
      } />
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>رفع صورة للفيلم أو المعرض</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm">الصورة</span>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm">العنوان</span>
            <Input 
              placeholder="عنوان الصورة..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm">الوصف (إختياري)</span>
            <Textarea 
              placeholder="وصف مختصر..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
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

          <Button type="submit" disabled={uploading || !file || !title}>
            {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : "حفظ ورفع"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
