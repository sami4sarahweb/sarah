"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { Service, ServiceProperty, ServiceMedia } from "@/types/services";
import { GalleryMedia } from "@/components/gallery/media-grid";
import { MediaPickerDialog } from "@/components/gallery/media-picker-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Save, Image as ImageIcon, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ServiceEditor({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === "new";
  const router = useRouter();
  const supabase = createClient();

  const [service, setService] = useState<Partial<Service>>({
    name: "", slug: "", description: "", details: "", is_active: true, sort_order: 0
  });
  const [properties, setProperties] = useState<Partial<ServiceProperty>[]>([]);
  const [mediaRelations, setMediaRelations] = useState<(ServiceMedia & { gallery_media: GalleryMedia })[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      loadServiceData();
    }
  }, [resolvedParams.id]);

  const loadServiceData = async () => {
    setLoading(true);
    
    // 1. Fetch Service
    const { data: sData } = await supabase.from("services").select("*").eq("id", resolvedParams.id).single();
    if (sData) setService(sData);

    // 2. Fetch Properties
    const { data: pData } = await supabase.from("service_properties").select("*").eq("service_id", resolvedParams.id).order("sort_order");
    if (pData) setProperties(pData);

    // 3. Fetch Media Join
    const { data: mData } = await supabase
      .from("service_media")
      .select("*, gallery_media(*)")
      .eq("service_id", resolvedParams.id)
      .order("sort_order");
    
    if (mData) {
      // @ts-ignore
      setMediaRelations(mData.filter(m => m.gallery_media !== null));
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let currentId = resolvedParams.id;
      
      // Save Service Table
      if (isNew) {
        const { data, error } = await supabase.from("services").insert({
          name: service.name || "",
          slug: service.slug || "",
          description: service.description,
          details: service.details,
          main_image_url: service.main_image_url,
          cover_image_url: service.cover_image_url,
          is_active: service.is_active,
          sort_order: service.sort_order
        }).select().single();
        if (error) throw error;
        currentId = data.id;
      } else {
        await supabase.from("services").update({
          name: service.name,
          slug: service.slug,
          description: service.description,
          details: service.details,
          main_image_url: service.main_image_url,
          cover_image_url: service.cover_image_url,
          is_active: service.is_active,
          sort_order: service.sort_order
        }).eq("id", currentId);
      }

      // Upsert Properties
      // Simple approach: delete existing and insert new (for a real app, careful with linked media, but here properties only have text)
      if (!isNew) {
        await supabase.from("service_properties").delete().eq("service_id", currentId);
      }
      
      if (properties.length > 0) {
        const propsToInsert = properties.map((p, i) => ({
          service_id: currentId,
          name: p.name || "",
          description: p.description || null,
          sort_order: i
        }));
        await supabase.from("service_properties").insert(propsToInsert);
      }

      // Redirect if new
      if (isNew) {
        router.push(`/dashboard/services/${currentId}`);
      } else {
        loadServiceData(); // Reload to get fresh IDs for properties
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء الحفظ");
    }
    setSaving(false);
  };

  const attachMedia = async (galleryItem: GalleryMedia) => {
    if (isNew) {
      alert("الرجاء حفظ الخدمة أولاً قبل إضافة الوسائط");
      return;
    }
    await supabase.from("service_media").insert({
      service_id: resolvedParams.id,
      media_id: galleryItem.id,
      role: 'gallery',
      sort_order: mediaRelations.length
    });
    loadServiceData();
  };

  const detachMedia = async (relationId: string) => {
    await supabase.from("service_media").delete().eq("id", relationId);
    loadServiceData();
  };

  if (loading) {
    return <Skeleton className="w-full h-[600px] rounded-xl" />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <header className="flex justify-between items-center bg-surface-container p-4 rounded-xl border border-border/50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/services">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{isNew ? 'خدمة جديدة' : service.name}</h1>
            <p className="text-xs text-muted-foreground mt-1">/{service.slug}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>التفاصيل الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm">اسم الخدمة (عربي)</label>
                  <Input 
                    value={service.name} 
                    onChange={e => setService({ ...service, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">رابط URL (Slug / إنجليزي)</label>
                  <Input 
                    value={service.slug} 
                    onChange={e => setService({ ...service, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm">وصف قصير (للبطاقات)</label>
                <Textarea 
                  value={service.description || ''} 
                  onChange={e => setService({ ...service, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm">التفاصيل الكاملة</label>
                <Textarea 
                  value={service.details || ''} 
                  onChange={e => setService({ ...service, details: e.target.value })}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>خصائص الخدمة / الأنواع المندرجة</CardTitle>
                <CardDescription>أضف الخصائص مثل "كنب فردي"، "خيام شفافة" الخ</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setProperties([...properties, { name: "" }])}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة خاصية
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {properties.map((prop, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-surface-container-high/50 p-2 rounded-lg border border-border/20">
                  <Input 
                    placeholder="اسم الخاصية" 
                    value={prop.name}
                    onChange={e => {
                      const newProps = [...properties];
                      newProps[idx].name = e.target.value;
                      setProperties(newProps);
                    }}
                    className="flex-1 bg-background"
                  />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => setProperties(properties.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {properties.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">لا توجد خصائص مضافة</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings (Images & Media) */}
        <div className="flex flex-col gap-6">
          
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>الصور الرئيسية</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm flex justify-between">
                  <span>الصورة الرئيسية (Hero)</span>
                  {service.main_image_url && (
                    <button className="text-xs text-destructive hover:underline" onClick={() => setService({...service, main_image_url: null})}>إزالة</button>
                  )}
                </label>
                {service.main_image_url ? (
                  <div className="h-32 rounded-lg overflow-hidden border border-border">
                    <img src={service.main_image_url} alt="Main" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-surface-container/50">
                    <MediaPickerDialog 
                      filterPrimaryType="image" 
                      title="تعيين صورة رئيسية"
                      onSelect={(media) => setService({...service, main_image_url: media.url})}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm flex justify-between">
                  <span>صورة الغلاف (العرضية)</span>
                  {service.cover_image_url && (
                    <button className="text-xs text-destructive hover:underline" onClick={() => setService({...service, cover_image_url: null})}>إزالة</button>
                  )}
                </label>
                {service.cover_image_url ? (
                  <div className="h-32 rounded-lg overflow-hidden border border-border">
                    <img src={service.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-surface-container/50">
                    <MediaPickerDialog 
                      filterPrimaryType="image" 
                      title="تعيين صورة غلاف"
                      onSelect={(media) => setService({...service, cover_image_url: media.url})}
                    />
                  </div>
                )}
              </div>

            </CardContent>
          </Card>

          {!isNew && (
            <Card className="glass-panel">
              <CardHeader className="flex flex-row justify-between items-center pb-2">
                <CardTitle>معرض الخدمة</CardTitle>
                <MediaPickerDialog 
                  title="إرفاق"
                  triggerButton={
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full">
                      <Plus className="w-4 h-4" />
                    </Button>
                  }
                  onSelect={attachMedia}
                />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {mediaRelations.map((rel) => {
                    const thumb = rel.gallery_media.thumbnail_url || rel.gallery_media.url; // simplistic thumb fallback
                    return (
                      <div key={rel.id} className="relative aspect-square rounded-md overflow-hidden group">
                        <img src={thumb} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={() => detachMedia(rel.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                  {mediaRelations.length === 0 && (
                    <div className="col-span-2 text-center py-6 text-xs text-muted-foreground border border-dashed rounded-lg">
                      لم يتم إرفاق صور إضافية
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
