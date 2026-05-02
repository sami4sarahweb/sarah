"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types/projects";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Star, Quote, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function TestimonialsDashboard() {
  const [testimonials, setTestimonials] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*")
      .not("testimonial_text", "is", null)
      .neq("testimonial_text", "")
      .order("created_at", { ascending: false });
    
    if (data) setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <header className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">شهادات العملاء</h1>
          <p className="text-muted-foreground mt-2">إدارة آراء وتقييمات العملاء المرفقة مع المشاريع.</p>
        </div>
        <Link href="/dashboard/projects">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة تقييم لمشروع
          </Button>
        </Link>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-container/30 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">لا توجد شهادات عملاء مضافة حتى الآن.</p>
          <Link href="/dashboard/projects">
            <Button variant="outline">اختر مشروعاً لإضافة تقييم</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((project) => (
            <Card key={project.id} className="glass-panel flex flex-col transition-all overflow-hidden border-tertiary/20 relative">
              <Quote className="absolute top-4 left-4 w-12 h-12 text-tertiary/10 rotate-180" />
              <CardHeader className="p-4 pb-2 z-10">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <CardTitle className="text-lg">{project.client_name || 'عميل غير محدد'}</CardTitle>
                    <Link href={`/dashboard/projects/${project.id}`} className="text-xs flex items-center gap-1 text-muted-foreground hover:text-tertiary mt-1 transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      مشروع: {project.title}
                    </Link>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-2 flex-1 flex flex-col gap-3 z-10">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${
                        (project.testimonial_rating || 0) >= star 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-muted-foreground/30'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-sm italic leading-relaxed text-foreground/90 bg-surface-container/30 p-3 rounded-lg border border-border/50">
                  "{project.testimonial_text}"
                </p>
              </CardContent>

              <CardFooter className="p-4 pt-0 border-t border-border/10 flex justify-end gap-2 mt-auto z-10">
                <Link href={`/dashboard/projects/${project.id}`}>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Edit className="w-4 h-4" />
                    تعديل التقييم
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
