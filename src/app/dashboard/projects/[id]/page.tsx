"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { Project, ProjectWithRelations } from "@/types/projects";
import { Service } from "@/types/services";
import { GalleryMedia } from "@/components/gallery/media-grid";
import { MediaPickerDialog } from "@/components/gallery/media-picker-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Save, Trash2, Plus, Star, Quote } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectEditor({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === "new";
  const router = useRouter();
  const supabase = createClient();

  const [project, setProject] = useState<Partial<Project>>({
    title: "", slug: "", description: "", is_active: true, sort_order: 0, testimonial_rating: 5
  });
  
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  
  const [mediaRelations, setMediaRelations] = useState<{ id: string, media_id: string, gallery_media: GalleryMedia }[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [resolvedParams.id]);

  const loadData = async () => {
    setLoading(true);
    
    // Fetch all active services for the selection pool
    const { data: servicesData } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order");
    if (servicesData) setAllServices(servicesData);

    if (!isNew) {
      // 1. Fetch Project
      const { data: pData } = await supabase.from("projects").select("*").eq("id", resolvedParams.id).single();
      if (pData) setProject(pData);

      // 2. Fetch Attached Services
      const { data: pServices } = await supabase.from("project_services").select("service_id").eq("project_id", resolvedParams.id);
      if (pServices) setSelectedServiceIds(pServices.map(ps => ps.service_id));

      // 3. Fetch Media Join
      const { data: mData } = await supabase
        .from("project_media")
        .select("id, media_id, gallery_media(*)")
        .eq("project_id", resolvedParams.id)
        .order("sort_order");
      
      if (mData) {
        // @ts-ignore
        setMediaRelations(mData.filter(m => m.gallery_media !== null));
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let currentId = resolvedParams.id;
      
      // Save Project Table
      const projectPayload = {
        title: project.title || "",
        slug: project.slug || "",
        description: project.description,
        client_name: project.client_name,
        event_date: project.event_date || null,
        main_image_url: project.main_image_url,
        cover_image_url: project.cover_image_url,
        testimonial_text: project.testimonial_text,
        testimonial_rating: project.testimonial_rating,
        is_active: project.is_active,
        sort_order: project.sort_order
      };

      if (isNew) {
        const { data, error } = await supabase.from("projects").insert(projectPayload).select().single();
        if (error) throw error;
        currentId = data.id;
      } else {
        const { error } = await supabase.from("projects").update(projectPayload).eq("id", currentId);
        if (error) throw error;
      }

      // Upsert Services Relation
      // First wipe existing relations
      if (!isNew) {
        await supabase.from("project_services").delete().eq("project_id", currentId);
      }
      
      // Then insert checked services
      if (selectedServiceIds.length > 0) {
        const servicesToInsert = selectedServiceIds.map(sid => ({
          project_id: currentId,
          service_id: sid
        }));
        await supabase.from("project_services").insert(servicesToInsert);
      }

      if (isNew) {
        router.push(`/dashboard/projects/${currentId}`);
      } else {
        alert("تم الحفظ بنجاح");
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء الحفظ");
    }
    setSaving(false);
  };

  const attachMedia = async (galleryItem: GalleryMedia) => {
    if (isNew) {
      alert("الرجاء حفظ المشروع أولاً قبل إضافة الوسائط");
      return;
    }
    await supabase.from("project_media").insert({
      project_id: resolvedParams.id,
      media_id: galleryItem.id,
      sort_order: mediaRelations.length
    });
    loadData();
  };

  const detachMedia = async (relationId: string) => {
    await supabase.from("project_media").delete().eq("id", relationId);
    setMediaRelations(prev => prev.filter(m => m.id !== relationId));
  };

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  if (loading) return <Skeleton className="w-full h-[600px] rounded-xl" />;

  return (
    <div className="flex flex-col gap-6 max-w-6xl pb-20">
      <header className="flex justify-between items-center bg-surface-container p-4 rounded-xl border border-border/50 sticky top-0 z-10 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{isNew ? 'مشروع جديد' : project.title}</h1>
            <p className="text-xs text-muted-foreground mt-1">/{project.slug}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Metadata & Details) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>تفاصيل المشروع</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm">اسم المشروع</label>
                  <Input 
                    value={project.title} 
                    onChange={e => setProject({ ...project, title: e.target.value })}
                    placeholder="مثال: تجهيز استيج حفل إطلاق منتج"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">رابط URL (Slug / إنجليزي)</label>
                  <Input 
                    value={project.slug} 
                    onChange={e => setProject({ ...project, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm">تاريخ الفعالية</label>
                <Input 
                  type="date"
                  value={project.event_date ? new Date(project.event_date).toISOString().split('T')[0] : ''} 
                  onChange={e => setProject({ ...project, event_date: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm">وصف المشروع الكامل</label>
                <Textarea 
                  value={project.description || ''} 
                  onChange={e => setProject({ ...project, description: e.target.value })}
                  rows={6}
                  placeholder="حدثنا عن المشروع وتفاصيل الإنجاز والتنظيم..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-tertiary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-tertiary">
                <Quote className="w-5 h-5" />
                <CardTitle>شهادة العميل للمشروع</CardTitle>
              </div>
              <CardDescription>إذا قام العميل بتقييم هذا المشروع، يمكنك إدراج تعليقه هنا</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">اسم العميل / الجهة</label>
                  <Input 
                    value={project.client_name || ''} 
                    onChange={e => setProject({ ...project, client_name: e.target.value })}
                    placeholder="مثال: شركة سابك"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">التقييم (من 1 إلى 5)</label>
                  <div className="flex items-center h-10 gap-2 bg-surface-container/50 px-4 rounded-md border border-border">
                    {[1,2,3,4,5].map(star => (
                      <Star 
                        key={star}
                        className={`w-5 h-5 cursor-pointer transition-colors ${
                          (project.testimonial_rating || 0) >= star 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-muted-foreground/30'
                        }`}
                        onClick={() => setProject({ ...project, testimonial_rating: star })}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">نص الشهادة / التقييم</label>
                <Textarea 
                  value={project.testimonial_text || ''} 
                  onChange={e => setProject({ ...project, testimonial_text: e.target.value })}
                  rows={3}
                  className="bg-surface-container/50 focus-visible:ring-tertiary"
                  placeholder="اكتب تعليق العميل هنا..."
                />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (Relations & Media) */}
        <div className="flex flex-col gap-6">
          
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>الخدمات المطبقة</CardTitle>
              <CardDescription>اربط هذا المشروع بالخدمات التي تم تقديمها فيه.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allServices.map(service => {
                  const isSelected = selectedServiceIds.includes(service.id);
                  return (
                    <Badge 
                      key={service.id} 
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer text-sm py-1.5 px-3 transition-colors ${isSelected ? 'bg-primary text-black hover:bg-primary/80' : 'hover:bg-surface-container-high'}`}
                      onClick={() => toggleService(service.id)}
                    >
                      {service.name}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>الصور الرئيسية</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm flex justify-between text-muted-foreground">
                  <span>الصورة المصغرة (للشبكة)</span>
                  {project.main_image_url && (
                    <button className="text-xs text-destructive hover:underline" onClick={() => setProject({...project, main_image_url: null})}>إزالة</button>
                  )}
                </label>
                {project.main_image_url ? (
                  <div className="h-32 rounded-lg overflow-hidden border border-border">
                    <img src={project.main_image_url} alt="Main" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-surface-container/50">
                    <MediaPickerDialog 
                      filterPrimaryType="image" 
                      title="تعيين صورة"
                      onSelect={(media) => setProject({...project, main_image_url: media.url})}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm flex justify-between text-muted-foreground">
                  <span>صورة الغلاف (Banner)</span>
                  {project.cover_image_url && (
                    <button className="text-xs text-destructive hover:underline" onClick={() => setProject({...project, cover_image_url: null})}>إزالة</button>
                  )}
                </label>
                {project.cover_image_url ? (
                  <div className="h-32 rounded-lg overflow-hidden border border-border">
                    <img src={project.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-surface-container/50">
                    <MediaPickerDialog 
                      filterPrimaryType="image" 
                      title="تعيين غلاف"
                      onSelect={(media) => setProject({...project, cover_image_url: media.url})}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {!isNew && (
            <Card className="glass-panel">
              <CardHeader className="flex flex-row justify-between items-center pb-2">
                <CardTitle>معرض المشروع</CardTitle>
                <MediaPickerDialog 
                  title="إرفاق صور/يوتيوب"
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
                    const thumb = rel.gallery_media.thumbnail_url || rel.gallery_media.url;
                    return (
                      <div key={rel.id} className="relative aspect-square rounded-md overflow-hidden group border border-border/50">
                        {rel.gallery_media.type.includes('youtube') && !rel.gallery_media.thumbnail_url && (
                           // fallback specifically for visually pleasing dashboard thumbnail without complex regex here
                           <div className="absolute inset-0 bg-primary/20 flex items-center justify-center text-primary font-bold z-10">يوتيوب</div> 
                        )}
                        <img src={thumb} className="w-full h-full object-cover relative z-0" />
                        <div className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
