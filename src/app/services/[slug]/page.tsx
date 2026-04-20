import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Phone, Video, Image as ImageIcon } from "lucide-react";
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

  const { data: service } = await supabase.from("services").select("name, description, main_image_url").eq("slug", slug).single();

  if (!service) return { title: "خدمة غير موجودة" };

  return {
    title: `${service.name} | Synthetic Pulse`,
    description: service.description,
    openGraph: {
      images: service.main_image_url ? [service.main_image_url] : [],
    }
  };
}

export default async function ServiceSlugPage({ params }: Props) {
  const { slug } = await params;
  
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { data: service } = await supabase
    .from("services")
    .select("*, service_properties(*), service_media(*, gallery_media(*))")
    .eq("slug", slug)
    .single();

  if (!service || !service.is_active) {
    notFound();
  }

  // Sort properties
  const properties = [...(service.service_properties || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  
  // Sort and filter media
  // @ts-ignore - TS types are complex with nested joins, but structure is reliable
  const mediaItems = [...(service.service_media || [])]
    .filter(m => m.gallery_media)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map(m => m.gallery_media);

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
        {/* Background Banner */}
        <div className="absolute inset-0 z-0">
          {service.cover_image_url ? (
            <img src={service.cover_image_url} alt={service.name} className="w-full h-full object-cover opacity-30 blur-sm mix-blend-luminosity" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6">
            <Link href="/services">
              <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowRight className="w-4 h-4" />
                عودة للخدمات
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="flex-1 space-y-6">
              <Badge variant="secondary" className="border-primary/20 text-primary">تجهيز و تأجير</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
                {service.name}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {service.description}
              </p>
              
              <div className="pt-6">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 bg-gradient-primary hover:luminous-shadow-primary text-black font-semibold rounded-full px-8">
                    <Phone className="w-5 h-5" />
                    احجز الآن
                  </Button>
                </Link>
              </div>
            </div>

            {/* Main Image */}
            <div className="flex-1 w-full max-w-lg">
              <div className="relative aspect-4/3 rounded-3xl overflow-hidden glass-panel border-glow-primary shadow-2xl p-2 bg-surface-container/50">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-black/40 relative">
                  {service.main_image_url ? (
                    <img src={service.main_image_url} alt={service.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details & Properties */}
      <section className="py-16 bg-surface-container/30 border-y border-border/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Details Text */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold border-b border-border/50 pb-4 inline-block pr-6 border-r-4 border-r-primary">الشرح والتفاصيل</h2>
              <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-loose whitespace-pre-line">
                {service.details || service.description || "لا يوجد تفاصيل إضافية مسجلة لهذه الخدمة."}
              </div>
            </div>

            {/* Properties List */}
            {properties.length > 0 && (
              <div className="space-y-6 bg-surface-container glass-panel p-8 rounded-3xl">
                <h3 className="text-2xl font-bold mb-6">أنواع و إضافات {service.name.split(' ')[0]}</h3>
                <div className="flex flex-col gap-4">
                  {properties.map((prop) => (
                    <div key={prop.id} className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors">
                      <CheckCircle2 className="w-6 h-6 text-tertiary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-lg">{prop.name}</h4>
                        {prop.description && (
                          <p className="text-sm text-muted-foreground mt-1">{prop.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </section>

      {/* Media Gallery (If Available) */}
      {mediaItems.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">معرض الخدمة</h2>
              <p className="text-muted-foreground">تصفح صور وفيديوهات لأعمالنا السابقة باستخدام هذه الخدمة.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mediaItems.map((item: any) => {
                const thumb = item.thumbnail_url || item.url;
                // Basic YouTube extraction for client-side rendering
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
                      {item.description && <p className="text-white/70 text-xs line-clamp-1">{item.description}</p>}
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
