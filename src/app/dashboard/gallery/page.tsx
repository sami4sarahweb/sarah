"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GalleryCategory, CategoryManager } from "@/components/gallery/category-manager";
import { UploadImageModal } from "@/components/gallery/upload-image-modal";
import { AddYoutubeModal } from "@/components/gallery/add-youtube-modal";
import { MediaGrid, GalleryMedia } from "@/components/gallery/media-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon, Video, FolderTree } from "lucide-react";

export default function GalleryDashboard() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchMedia = async () => {
    const { data } = await supabase
      .from("gallery_media")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setMedia(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("gallery_categories")
      .select("*")
      .order("name");
      
    if (data) setCategories(data);
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchMedia(), fetchCategories()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteMedia = async (id: string) => {
    // We should ideally delete the physical storage object if it's an image.
    const mediaItem = media.find(m => m.id === id);
    if (mediaItem) {
      if (mediaItem.type === 'image' && mediaItem.url) {
        try {
          const path = mediaItem.url.split('/').pop();
          if (path) await supabase.storage.from("gallery").remove([path]);
        } catch (e) {
          console.error("Failed to delete storage object", e);
        }
      }
      if (mediaItem.thumbnail_url) {
        try {
          const path = mediaItem.thumbnail_url.split('/').pop();
          if (path) await supabase.storage.from("gallery").remove([path]);
        } catch (e) { }
      }
    }
    
    await supabase.from("gallery_media").delete().eq("id", id);
    fetchMedia();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <header className="mb-4">
          <h1 className="text-3xl font-bold">المعرض</h1>
          <p className="text-muted-foreground mt-2">إدارة مكتبة الصور والفيديوهات والتصنيفات الخاصة بك.</p>
        </header>
        <Skeleton className="h-12 w-[300px] rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">المعرض</h1>
        <p className="text-muted-foreground mt-2">إدارة مكتبة الصور والفيديوهات والتصنيفات الخاصة بك.</p>
      </header>

      <Tabs defaultValue="images" className="w-full">
        <TabsList className="mb-4 bg-surface-container">
          <TabsTrigger value="images" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            الصور
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <Video className="h-4 w-4" />
            الفيديوهات (يوتيوب)
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderTree className="h-4 w-4" />
            التصنيفات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="flex flex-col gap-6">
          <div className="flex justify-between items-center bg-surface-container/50 p-4 rounded-xl border border-border/10">
            <div>
              <h2 className="text-lg font-semibold">مكتبة الصور</h2>
              <p className="text-sm text-muted-foreground">تصفح وإدارة الصور المرفوعة.</p>
            </div>
            <UploadImageModal categories={categories} onSuccess={fetchMedia} />
          </div>
          <MediaGrid 
            items={media} 
            categories={categories} 
            onDelete={handleDeleteMedia} 
            filterPrimaryType="image" 
          />
        </TabsContent>

        <TabsContent value="videos" className="flex flex-col gap-6">
          <div className="flex justify-between items-center bg-surface-container/50 p-4 rounded-xl border border-border/10">
            <div>
              <h2 className="text-lg font-semibold">مكتبة الفيديوهات</h2>
              <p className="text-sm text-muted-foreground">تصفح وإدارة فيديوهات اليوتيوب.</p>
            </div>
            <AddYoutubeModal categories={categories} onSuccess={fetchMedia} />
          </div>
          <MediaGrid 
            items={media} 
            categories={categories} 
            onDelete={handleDeleteMedia} 
            filterPrimaryType="video" 
          />
        </TabsContent>

        <TabsContent value="categories">
          {/* We pass setCategories to immediately reflect updates inside the other tabs too */}
          <CategoryManager onChange={setCategories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
