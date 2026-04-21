"use client";

import { useState, useRef } from "react";
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
  SelectValue,
} from "@/components/ui/select";
import { GalleryCategory } from "./category-manager";
import { GalleryMedia } from "./media-grid";
import { ImagePlus, Loader2, X, CheckCircle2, AlertCircle, Upload } from "lucide-react";

interface FileEntry {
  file: File;
  title: string;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  result?: GalleryMedia;
}

// ─── Standalone Upload Form (reusable in both modal & picker) ──────────────
export function UploadForm({
  categories,
  onSuccess,
  compact = false,
}: {
  categories: GalleryCategory[];
  onSuccess: (items: GalleryMedia[]) => void;
  compact?: boolean;
}) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newEntries: FileEntry[] = Array.from(fileList).map((f) => ({
      file: f,
      title: f.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "),
      preview: URL.createObjectURL(f),
      status: "pending" as const,
    }));
    setFiles((prev) => [...prev, ...newEntries]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const updateTitle = (idx: number, title: string) => {
    setFiles((prev) => prev.map((f, i) => (i === idx ? { ...f, title } : f)));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const handleUploadAll = async () => {
    if (files.length === 0) return;
    setUploading(true);
    const results: GalleryMedia[] = [];

    for (let idx = 0; idx < files.length; idx++) {
      const entry = files[idx];
      if (entry.status === "done") continue;

      setFiles((prev) => prev.map((f, i) => (i === idx ? { ...f, status: "uploading" } : f)));

      try {
        const fileExt = entry.file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(fileName, entry.file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(uploadData.path);

        const { data: dbRow, error: dbError } = await supabase
          .from("gallery_media")
          .insert({
            type: "image",
            url: publicUrlData.publicUrl,
            title: entry.title || entry.file.name,
            description: description || null,
            category_id: categoryId || null,
          })
          .select()
          .single();

        if (dbError) throw dbError;

        results.push(dbRow);
        setFiles((prev) =>
          prev.map((f, i) => (i === idx ? { ...f, status: "done", result: dbRow } : f))
        );
      } catch (err) {
        console.error("Upload error:", err);
        setFiles((prev) => prev.map((f, i) => (i === idx ? { ...f, status: "error" } : f)));
      }
    }

    setUploading(false);

    if (results.length > 0) {
      onSuccess(results);
    }
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const doneCount = files.filter((f) => f.status === "done").length;

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border/50 hover:border-primary/50 rounded-xl p-8 text-center cursor-pointer transition-colors bg-surface-container/30"
      >
        <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          اسحب الصور هنا أو <span className="text-primary font-semibold">تصفّح الملفات</span>
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">يمكنك رفع عدة صور دفعةً واحدة</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className={`flex flex-col gap-2 max-h-60 overflow-y-auto ${compact ? "max-h-40" : ""}`}>
          {files.map((entry, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2 rounded-lg bg-surface-container border border-border/20"
            >
              <img
                src={entry.preview}
                alt=""
                className="w-12 h-12 rounded-md object-cover shrink-0"
              />
              <Input
                value={entry.title}
                onChange={(e) => updateTitle(idx, e.target.value)}
                placeholder="عنوان الصورة"
                className="flex-1 h-9 text-xs bg-background"
                disabled={entry.status === "done"}
              />
              <div className="w-6 shrink-0 flex items-center justify-center">
                {entry.status === "uploading" && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                {entry.status === "done" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {entry.status === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
                {entry.status === "pending" && (
                  <button onClick={() => removeFile(idx)} className="text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shared metadata */}
      {files.length > 0 && (
        <div className={`grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">التصنيف (يُطبق على الكل)</span>
            <Select value={categoryId} onValueChange={(val) => setCategoryId(val || "")}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="اختر تصنيفاً..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.parent_id ? `↳ ${c.name}` : c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">وصف مشترك (اختياري)</span>
            <Textarea
              placeholder="وصف مختصر..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={1}
              className="text-xs min-h-9"
            />
          </div>
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && (
        <Button
          onClick={handleUploadAll}
          disabled={uploading || pendingCount === 0}
          className="gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري الرفع ({doneCount}/{files.length})...
            </>
          ) : doneCount === files.length && files.length > 0 ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              تم رفع {doneCount} صورة
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              رفع {pendingCount} صورة
            </>
          )}
        </Button>
      )}
    </div>
  );
}

// ─── Modal Wrapper (backward-compatible) ──────────────
export function UploadImageModal({
  categories,
  onSuccess,
}: {
  categories: GalleryCategory[];
  onSuccess: (items?: GalleryMedia[]) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="gap-2">
          <ImagePlus className="h-4 w-4" />
          رفع صور
        </Button>
      } />
      <DialogContent className="glass-panel max-w-lg">
        <DialogHeader>
          <DialogTitle>رفع صور للمعرض</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <UploadForm
            categories={categories}
            onSuccess={(items) => {
              onSuccess(items);
              setOpen(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
