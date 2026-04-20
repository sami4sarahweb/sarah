"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types/projects";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye, EyeOff, Image as ImageIcon, Calendar } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    
    if (data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase.from("projects").update({ is_active: !currentStatus }).eq("id", id);
    fetchProjects();
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">المشاريع</h1>
          <p className="text-muted-foreground mt-2">إدارة سجل المشاريع والفعاليات المنفذة وشهادات العملاء.</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة مشروع
          </Button>
        </Link>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-container/30 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">لا توجد مشاريع مضافة حتى الآن.</p>
          <Link href="/dashboard/projects/new">
            <Button variant="outline">أضف مشرعك الأول</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className={`glass-panel flex flex-col transition-all overflow-hidden ${!project.is_active ? 'opacity-60 saturate-50' : ''}`}>
              {project.cover_image_url || project.main_image_url ? (
                <div className="h-40 w-full overflow-hidden bg-black/20">
                  <img 
                    src={project.cover_image_url || project.main_image_url || ''} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 w-full bg-surface-container flex flex-col items-center justify-center text-muted-foreground border-b border-border/20">
                  <ImageIcon className="h-8 w-8 opacity-20 mb-2" />
                  <span className="text-xs">بدون صورة</span>
                </div>
              )}
              
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base line-clamp-1 flex-1">{project.title}</CardTitle>
                  <Badge variant={project.is_active ? "default" : "secondary"} className="shrink-0">
                    {project.is_active ? 'نشط' : 'مخفي'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0 flex-1 flex flex-col gap-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description || 'لا يوجد وصف.'}
                </p>
                {project.event_date && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-auto pt-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(project.event_date).toLocaleDateString('ar-SA')}</span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-4 pt-0 border-t border-border/10 flex justify-between gap-2 mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-muted-foreground hover:text-foreground flex-1"
                  onClick={() => toggleActive(project.id, !!project.is_active)}
                >
                  {project.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {project.is_active ? 'إخفاء' : 'إظهار'}
                </Button>
                <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full gap-2">
                    <Edit className="w-4 h-4" />
                    تعديل
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
