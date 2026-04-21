import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";
import Link from "next/link";
import { LayoutGrid, ArrowLeft, Star, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "المشاريع والفعاليات | Synthetic Pulse",
  description: "اكتشف سجل أعمالنا وتجهيزاتنا في كبرى الفعاليات والحفلات، واقرأ شهادات عملائنا حول مدى جودة التنظيم والتأجير.",
};

export default async function ProjectsListing() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_active", true)
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("sort_order", { ascending: true });

  if (!projects || projects.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">المشاريع المنفذة</h1>
        <p className="text-muted-foreground">لا توجد مشاريع متاحة حالياً لتعرض.</p>
      </div>
    );
  }

  // Find featured (Highest rated or newest)
  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4 text-secondary border-secondary/20 bg-secondary/10">سجل إنجازاتنا</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-l from-foreground to-foreground/60">
            أعمال نفخر بتجهيزها
          </h1>
          <p className="text-lg text-muted-foreground">
            تصفح معرض أعمالنا في كبرى الفعاليات والمناسبات التي كان لنا شرف وضع بصمتنا وإنجاح مسيرتها بدقة واحترافية.
          </p>
        </div>

        {/* Featured Banner */}
        {featured && (
          <Link href={`/projects/${featured.slug}`} className="block mb-12 group">
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-border/50 glass-panel hover:border-glow-primary transition-all">
              <div className="absolute inset-0 bg-surface-container">
                {featured.cover_image_url || featured.main_image_url ? (
                  <img src={featured.cover_image_url || featured.main_image_url || ''} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black/40"><LayoutGrid className="w-16 h-16 opacity-20" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row gap-6 md:items-end justify-between">
                <div className="max-w-2xl">
                  {featured.event_date && (
                    <div className="flex items-center gap-2 text-primary text-sm mb-3">
                      <Calendar className="w-4 h-4" />
                      {new Date(featured.event_date).toLocaleDateString('ar-SA')}
                    </div>
                  )}
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">{featured.title}</h2>
                  <p className="text-muted-foreground line-clamp-2 md:text-lg">{featured.description}</p>
                </div>
                {featured.testimonial_rating && featured.testimonial_rating > 0 && (
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-500/30">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${featured.testimonial_rating && featured.testimonial_rating >= s ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`} className="group block">
              <div className="relative glass-panel rounded-2xl overflow-hidden flex flex-col h-full border border-border/50 hover:border-border transition-colors">
                
                <div className="h-56 w-full overflow-hidden bg-black/20">
                  {project.main_image_url || project.cover_image_url ? (
                    <img 
                      src={project.main_image_url || project.cover_image_url || ''} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <LayoutGrid className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col relative bg-gradient-to-t from-surface-container-high to-surface-container/20">
                  {project.testimonial_rating && project.testimonial_rating > 0 && (
                     <div className="absolute top-0 right-6 -translate-y-1/2 flex items-center gap-0.5 bg-background shadow-xl px-3 py-1.5 rounded-full border border-border/50">
                       <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                       <span className="text-xs font-bold pt-0.5 ml-1">{project.testimonial_rating}.0</span>
                     </div>
                  )}

                  {project.event_date && (
                    <span className="text-xs text-primary mb-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(project.event_date).toLocaleDateString('ar-SA')}
                    </span>
                  )}
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {project.description || 'تفاصيل المشروع'}
                  </p>
                  
                  <div className="flex items-center text-foreground/70 text-sm font-semibold justify-between mt-auto group-hover:text-primary transition-colors">
                    <span>قراءة المزيد</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
