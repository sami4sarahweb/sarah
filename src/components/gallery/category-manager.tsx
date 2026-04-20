"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Folder } from "lucide-react";

export type GalleryCategory = Database['public']['Tables']['gallery_categories']['Row'];

export function CategoryManager({ 
  onChange 
}: { 
  onChange?: (categories: GalleryCategory[]) => void 
}) {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchCategories = async () => {
    const { data } = await supabase.from("gallery_categories").select("*").order("name");
    if (data) {
      setCategories(data);
      onChange?.(data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat) return;
    setLoading(true);
    await supabase.from("gallery_categories").insert({ name: newCat });
    setNewCat("");
    setLoading(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("gallery_categories").delete().eq("id", id);
    fetchCategories();
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-primary" />
          <CardTitle>إدارة التصنيفات</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="إضافة تصنيف جديد..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !newCat}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full text-sm border border-border/10">
              <span>{c.name}</span>
              <button 
                onClick={() => handleDelete(c.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                title="حذف التصنيف"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground">لا توجد تصنيفات حالياً.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
