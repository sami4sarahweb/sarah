import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { FaIcon } from "@/components/ui/fa-icon";
import { faTrophy, faStar, faCalendarDays, faGripVertical, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AnimatedText } from "@/components/animations/animated-text";
import { AnimatedSection } from "@/components/animations/animated-section";
import { ParallaxLayer } from "@/components/animations/parallax-layer";

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
      <div className="container-wide px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">المشاريع المنفذة</h1>
        <p className="text-muted-foreground">لا توجد مشاريع متاحة حالياً لتعرض.</p>
      </div>
    );
  }

  // Find featured (Highest rated or newest)
  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <div className="min-h-screen bg-background pt-28 pb-16 md:pt-36 flex flex-col">
      <div className="container-wide px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Badge variant="secondary" className="mb-4 text-secondary border-secondary/20 bg-secondary/10 gap-2 px-4 py-1.5 hover-glow">
              <FaIcon icon={faTrophy} className="w-3.5 h-3.5 text-secondary" />
              سجل إنجازاتنا
            </Badge>
          </AnimatedSection>
          
          <AnimatedText
            text="أعمال نفخر بتجهيزها"
            type="chars"
            className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-l from-foreground to-foreground/60"
          />
          
          <AnimatedSection animation="fade-up" delay={0.3}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              تصفح معرض أعمالنا في كبرى الفعاليات والمناسبات التي كان لنا شرف وضع بصمتنا وإنجاح مسيرتها بدقة واحترافية.
            </p>
          </AnimatedSection>
        </div>

        {/* Featured Banner */}
        {featured && (
          <AnimatedSection animation="fade-up" delay={0.4}>
            <Link href={`/projects/${featured.slug}`} className="block mb-16 group">
              <div className="relative w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden glass-panel hover-border-glow transition-all">
                <div className="absolute inset-0 bg-surface-container overflow-hidden">
                  {featured.cover_image_url || featured.main_image_url ? (
                    <ParallaxLayer speed={-0.2} className="w-full h-full">
                      <img src={featured.cover_image_url || featured.main_image_url || ''} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 origin-center" />
                    </ParallaxLayer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/40">
                      <FaIcon icon={faGripVertical} className="w-16 h-16 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
                </div>
                
                <div className="absolute bottom-0 start-0 end-0 p-6 md:p-10 flex flex-col md:flex-row gap-6 md:items-end justify-between">
                  <div className="max-w-2xl">
                    {featured.event_date && (
                      <AnimatedSection animation="fade-up" delay={0.5}>
                        <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-3">
                          <FaIcon icon={faCalendarDays} className="w-4 h-4" />
                          {new Date(featured.event_date).toLocaleDateString('ar-SA')}
                        </div>
                      </AnimatedSection>
                    )}
                    
                    <AnimatedText
                      text={featured.title}
                      type="words"
                      tag="h2"
                      stagger={0.1}
                      className="text-3xl md:text-5xl font-bold mb-4"
                    />
                    
                    <AnimatedSection animation="fade-up" delay={0.6}>
                      <p className="text-muted-foreground line-clamp-2 md:text-lg leading-relaxed">{featured.description}</p>
                    </AnimatedSection>
                  </div>
                  
                  {featured.testimonial_rating && featured.testimonial_rating > 0 && (
                    <AnimatedSection animation="scale-in" delay={0.7}>
                      <div className="flex items-center gap-1.5 bg-background/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-yellow-500/30">
                        {[1,2,3,4,5].map(s => (
                          <FaIcon key={s} icon={faStar} className={`w-4 h-4 ${featured.testimonial_rating! >= s ? 'text-yellow-400' : 'text-muted-foreground/30'}`} />
                        ))}
                      </div>
                    </AnimatedSection>
                  )}
                </div>
              </div>
            </Link>
          </AnimatedSection>
        )}

        {/* Projects Grid */}
        <AnimatedSection animation="stagger-children" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {rest.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`} className="group block">
              <div className="relative glass-panel rounded-2xl overflow-hidden flex flex-col h-full border border-border/50 hover:border-primary/40 transition-colors">
                
                <div className="h-56 w-full overflow-hidden bg-black/20">
                  {project.main_image_url || project.cover_image_url ? (
                    <img 
                      src={project.main_image_url || project.cover_image_url || ''} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <FaIcon icon={faGripVertical} className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col relative bg-gradient-to-t from-surface-container-high to-surface-container/20">
                  {project.testimonial_rating && project.testimonial_rating > 0 && (
                     <div className="absolute top-0 end-6 -translate-y-1/2 flex items-center gap-1 bg-background shadow-glow-sm px-3 py-1.5 rounded-full border border-border/50">
                       <FaIcon icon={faStar} className="w-3.5 h-3.5 text-yellow-400" />
                       <span className="text-xs font-bold pt-0.5 ms-1">{project.testimonial_rating}.0</span>
                     </div>
                  )}

                  {project.event_date && (
                    <span className="text-xs text-primary font-medium mb-3 flex items-center gap-1.5">
                      <FaIcon icon={faCalendarDays} className="w-3 h-3" />
                      {new Date(project.event_date).toLocaleDateString('ar-SA')}
                    </span>
                  )}
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {project.description || 'تفاصيل المشروع'}
                  </p>
                  
                  <div className="flex items-center text-foreground/70 text-sm font-semibold justify-between mt-auto group-hover:text-primary transition-colors">
                    <span>قراءة المزيد</span>
                    <FaIcon icon={faArrowLeft} className="w-4 h-4 transition-transform group-hover:-translate-x-2 rtl:group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </AnimatedSection>
        
      </div>
    </div>
  );
}
