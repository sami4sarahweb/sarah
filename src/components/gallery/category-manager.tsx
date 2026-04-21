"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Folder, CornerDownLeft } from "lucide-react";

export type GalleryCategory = Database['public']['Tables']['gallery_categories']['Row'];

export function CategoryManager({
  onChange
}: {
  onChange?: (categories: GalleryCategory[]) => void
}) {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [newCat, setNewCat] = useState("");
  const [parentId, setParentId] = useState<string>("none");
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
    await supabase.from("gallery_categories").insert({
      name: newCat,
      parent_id: parentId === "none" ? null : parentId
    });
    setNewCat("");
    setParentId("none");
    setLoading(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("gallery_categories").delete().eq("id", id);
    fetchCategories();
  };

  const rootCategories = categories.filter(c => !c.parent_id);

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-primary" />
          <CardTitle>إدارة التصنيفات</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <form onSubmit={handleAdd} className="flex gap-2">
          <Select value={parentId} onValueChange={(val) => setParentId(val ?? "none")} disabled={loading}>
            <SelectTrigger className="w-1/3">
              <SelectValue placeholder="التصنيف الأب (اختياري)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">بدون (تصنيف رئيسي)</SelectItem>
              {rootCategories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="اسم التصنيف..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !newCat}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex flex-col gap-4">
          {rootCategories.map((root) => {
            const subCategories = categories.filter(c => c.parent_id === root.id);
            return (
              <div key={root.id} className="flex flex-col gap-2 p-3 bg-surface-container rounded-xl border border-border/10">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm bg-background px-3 py-1 rounded-full border border-border/50">{root.name}</span>
                  <button onClick={() => handleDelete(root.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {subCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 pr-6 mt-1 border-r-2 border-primary/20">
                    {subCategories.map(sub => (
                      <div key={sub.id} className="flex items-center gap-2 bg-background px-3 py-1 rounded-full text-xs border border-border/30">
                        <CornerDownLeft className="w-3 h-3 text-muted-foreground" />
                        <span>{sub.name}</span>
                        <button onClick={() => handleDelete(sub.id)} className="text-muted-foreground hover:text-destructive ml-1">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">لا توجد تصنيفات حالياً.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
