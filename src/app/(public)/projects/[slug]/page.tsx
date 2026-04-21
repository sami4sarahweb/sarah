import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Calendar, Quote, Briefcase, Video } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { data: project } = await supabase.from("projects").select("title, description, main_image_url").eq("slug", slug).single();

  if (!project) return { title: "مشروع غير موجود" };

  return {
    title: `${project.title} | مشاريع Synthetic Pulse`,
    description: project.description,
    openGraph: {
      images: project.main_image_url ? [project.main_image_url] : [],
    }
  };
}

export default async function ProjectSlugPage({ params }: Props) {
  const { slug } = await params;
  
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { data: project } = await supabase
    .from("projects")
    .select("*, project_services(services(*)), project_media(*, gallery_media(*))")
    .eq("slug", slug)
    .single();

  if (!project || !project.is_active) {
    notFound();
  }

  // Extract related elements safely
  const services = (project.project_services || [])
    // @ts-ignore
    .map(ps => ps.services)
    .filter(Boolean);

  const mediaItems = [...(project.project_media || [])]
    // @ts-ignore
    .filter(m => m.gallery_media)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    // @ts-ignore
    .map(m => m.gallery_media);

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Banner (Dynamic Parallax Layering) */}
      <section className="relative pt-24 pb-12 overflow-hidden bg-black min-h-[50vh] flex items-center border-b border-border">
        {project.cover_image_url || project.main_image_url ? (
          <img 
            src={project.cover_image_url || project.main_image_url || ''} 
            alt={project.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-30 select-none pointer-events-none" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-container to-background"></div>
        )}
        
        {/* Synthetic Pulse Linear Gradients overlaying the Hero */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/projects" className="inline-flex mb-8">
            <Button variant="outline" className="gap-2 bg-background/20 backdrop-blur-md text-foreground hover:bg-background/40">
              <ArrowLeft className="w-4 h-4" />
              العودة لسجل المشاريع
            </Button>
          </Link>

          <div className="max-w-4xl border-r-4 border-primary pr-6">
            <Badge variant="secondary" className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">
              مشروع مكتمل
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl text-neon-primary">
              {project.title}
            </h1>
            
            {project.event_date && (
              <div className="flex items-center gap-2 text-muted-foreground bg-black/40 backdrop-blur-md inline-flex px-4 py-2 rounded-full border border-border/50">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="pt-0.5">{new Date(project.event_date).toLocaleDateString('ar-SA')}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Column 1: Details & Testimonial */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Description Body */}
              <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-loose">
                <h2 className="text-2xl font-bold text-foreground mb-6">عن المشروع</h2>
                <div dangerouslySetInnerHTML={{ __html: (project.description || '').replace(/\n/g, '<br/>') }} />
              </div>

              {/* High-End Testimonial Block */}
              {project.testimonial_text && (
                <div className="relative mt-16 p-8 md:p-12 glass-panel rounded-3xl border border-secondary/20 luminous-shadow-primary overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Quote className="w-32 h-32 text-secondary" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      {[1,2,3,4,5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-6 h-6 ${
                            project.testimonial_rating && project.testimonial_rating >= star 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-muted-foreground/20'
                          }`} 
                        />
                      ))}
                    </div>
                    
                    <blockquote className="text-xl md:text-2xl italic font-medium leading-relaxed text-foreground mb-8">
                      "{project.testimonial_text}"
                    </blockquote>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-lg shadow-lg">
                        {(project.client_name || 'ع').charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{project.client_name || 'عميل'}</div>
                        <div className="text-sm text-primary">صاحب الفعالية</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Sidebar (Services Used) */}
            <div className="space-y-8">
              <div className="glass-panel p-6 rounded-2xl sticky top-24">
                <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">الخدمات المنفذة</h3>
                </div>

                {services.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {services.map((svc: any) => (
                      <Link key={svc.id} href={`/services/${svc.slug}`}>
                        <div className="group flex items-center justify-between p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-border/50 transition-colors">
                          <span className="font-medium text-sm group-hover:text-primary transition-colors">{svc.name}</span>
                          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:-translate-x-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">لم يتم تحديد خدمات معينة لهذا المشروع.</p>
                )}

                <div className="mt-8 pt-6 border-t border-border/50">
                  <h4 className="font-bold mb-2">هل تخطط لفعالية مشابهة؟</h4>
                  <p className="text-sm text-muted-foreground mb-4">يسعدنا تقديم استشارة مجانية وتقديم عرض سعر مخصص.</p>
                  <Link href="/contact" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-black font-semibold">
                      تواصل معنا الآن
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {mediaItems.length > 0 && (
        <section className="py-20 bg-surface-container/30 border-t border-border/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">لقطات من الحدث</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaItems.map((item: any) => {
                const thumb = item.thumbnail_url || item.url;
                let safeThumb = thumb;
                if (item.type.includes('youtube') && !item.thumbnail_url) {
                  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                  const match = item.url.match(regExp);
                  if (match && match[2].length === 11) safeThumb = `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
                }

                return (
                  <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden glass-panel">
                    <img 
                      src={safeThumb} 
                      alt={item.title} 
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.type === 'youtube_short' ? 'object-contain bg-black' : ''}`} 
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      {item.type.includes('youtube') && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/90 text-black rounded-full flex items-center justify-center shadow-lg">
                          <Video className="w-6 h-6 ml-1" />
                        </div>
                      )}
                      <h4 className="text-white font-semibold line-clamp-1">{item.title}</h4>
                    </div>

                    {item.type.includes('youtube') && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="absolute inset-0 z-10">
                        <span className="sr-only">مشاهدة الفيديو</span>
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
