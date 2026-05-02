import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { FaIcon } from "@/components/ui/fa-icon";
import { faArrowRight, faArrowLeft, faCircleCheck, faPhone, faPlay, faImage } from "@fortawesome/free-solid-svg-icons";
import { AnimatedText } from "@/components/animations/animated-text";
import { AnimatedSection } from "@/components/animations/animated-section";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { ParallaxLayer } from "@/components/animations/parallax-layer";
import { MagneticButton } from "@/components/animations/magnetic-button";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase.from("services").select("name, description, main_image_url").eq("slug", slug).single();

  if (!service) return { title: "خدمة غير موجودة" };

  return {
    title: `${service.name} | مؤسسة سارة السهلي`,
    description: service.description,
    openGraph: {
      images: service.main_image_url ? [service.main_image_url] : [],
    },
  };
}

interface ServiceProperty {
  id: string;
  name: string;
  description: string | null;
  sort_order: number | null;
}

interface MediaJoin {
  id: string;
  gallery_media: {
    id: string;
    type: string;
    url: string;
    thumbnail_url: string | null;
    title: string;
    description: string | null;
  } | null;
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("*, service_properties(*, gallery_category_id), service_media(*, gallery_media(*))")
    .eq("slug", slug)
    .single();

  if (!service || !service.is_active) {
    notFound();
  }

  const properties = [...(service.service_properties as ServiceProperty[] || [])].sort(
    (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
  );

  // Direct service_media links
  const directMedia = [...(service.service_media as MediaJoin[] || [])]
    .filter((m) => m.gallery_media)
    .map((m) => m.gallery_media!);

  // Also fetch media from the service's assigned gallery_category_id (+ subcategories)
  let categoryMedia: typeof directMedia = [];
  if (service.gallery_category_id) {
    // Get subcategory IDs too
    const { data: subCats } = await supabase
      .from("gallery_categories")
      .select("id")
      .eq("parent_id", service.gallery_category_id);
    
    const catIds = [service.gallery_category_id, ...(subCats?.map(c => c.id) || [])];
    
    const { data: catMedia } = await supabase
      .from("gallery_media")
      .select("id, type, url, thumbnail_url, title, description")
      .in("category_id", catIds)
      .order("created_at", { ascending: false })
      .limit(20);
    
    if (catMedia) categoryMedia = catMedia;
  }

  // Merge and deduplicate by id
  const seenIds = new Set(directMedia.map(m => m.id));
  const mediaItems = [...directMedia];
  for (const cm of categoryMedia) {
    if (!seenIds.has(cm.id)) {
      mediaItems.push(cm);
      seenIds.add(cm.id);
    }
  }

  // Fetch other services for "related services" navigation
  const { data: otherServices } = await supabase
    .from("services")
    .select("name, slug, description, main_image_url")
    .eq("is_active", true)
    .neq("slug", slug)
    .order("sort_order", { ascending: true })
    .limit(4);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          {service.cover_image_url ? (
            <ParallaxLayer speed={-0.3} className="w-full h-full">
              <img src={service.cover_image_url} alt={service.name} className="w-full h-full object-cover opacity-20 blur-sm" />
            </ParallaxLayer>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background"></div>
          <div className="absolute inset-0 bg-dots opacity-30" />
        </div>

        <div className="container-wide relative z-10 px-6">
          {/* Breadcrumb */}
          <RevealOnScroll direction="inline-start" delay={0.1}>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium mb-8"
            >
              <FaIcon icon={faArrowRight} className="w-4 h-4 arrow-navigate" />
              العودة للخدمات
            </Link>
          </RevealOnScroll>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div className="flex-1 space-y-6">
              <AnimatedSection animation="fade-up" delay={0.2}>
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-wide">
                  تجهيز و تأجير
                </span>
              </AnimatedSection>
              
              <AnimatedText 
                text={service.name}
                type="chars"
                stagger={0.03}
                tag="h1"
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
              />
              
              <AnimatedSection animation="fade-up" delay={0.4}>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  {service.description}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={0.5}>
                <div className="pt-4 flex flex-wrap gap-3">
                  <MagneticButton strength={0.15}>
                    <Link
                      href="/request-quote"
                      className="btn-primary"
                    >
                      <FaIcon icon={faPhone} className="w-4 h-4" />
                      احجز الآن
                    </Link>
                  </MagneticButton>
                  <MagneticButton strength={0.1}>
                    <a
                      href="#properties"
                      className="btn-secondary group/btn"
                    >
                      تفاصيل الخدمة
                      <FaIcon icon={faArrowLeft} className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1 rtl:group-hover/btn:translate-x-1" />
                    </a>
                  </MagneticButton>
                </div>
              </AnimatedSection>
            </div>

            {/* Main Image */}
            <div className="w-full lg:w-5/12 shrink-0">
              <AnimatedSection animation="scale-in" delay={0.3} duration={1}>
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-surface-container-high border border-border/30 shadow-2xl group">
                  {service.main_image_url ? (
                    <img src={service.main_image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaIcon icon={faImage} className="w-16 h-16 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ DETAILS & PROPERTIES ═══════════════ */}
      <section className="py-20 bg-surface-container/30 border-t border-border/30" id="properties">
        <div className="container-wide max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Details */}
            <AnimatedSection animation="fade-up" delay={0.1} className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">الشرح والتفاصيل</h2>
              <div className="w-16 h-1 bg-primary rounded-full divider-glow"></div>
              <div className="text-muted-foreground leading-loose whitespace-pre-line text-base">
                {service.details || service.description || "لا يوجد تفاصيل إضافية مسجلة لهذه الخدمة."}
              </div>
            </AnimatedSection>

            {/* Properties */}
            {properties.length > 0 && (
              <AnimatedSection animation="fade-up" delay={0.2}>
                <h3 className="text-2xl font-bold text-foreground mb-6">ما يشمل هذه الخدمة</h3>
                <AnimatedSection animation="stagger-children" className="flex flex-col gap-4">
                  {properties.map((prop) => (
                    <div
                      key={prop.id}
                      className="flex items-start gap-4 p-5 rounded-2xl glass-panel hover-border-glow transition-all duration-300"
                    >
                      <FaIcon icon={faCircleCheck} className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-foreground text-lg">{prop.name}</h4>
                        {prop.description && (
                          <p className="text-sm text-muted-foreground mt-1">{prop.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </AnimatedSection>
              </AnimatedSection>
            )}

          </div>
        </div>
      </section>

      {/* ═══════════════ MEDIA GALLERY ═══════════════ */}
      {mediaItems.length > 0 && (
        <section className="py-20">
          <div className="container-wide px-6">
            <AnimatedSection animation="fade-up" delay={0.1} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">معرض الخدمة</h2>
              <p className="text-muted-foreground">تصفح صور وفيديوهات لأعمالنا السابقة</p>
            </AnimatedSection>

            <AnimatedSection animation="stagger-children" delay={0.2} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mediaItems.map((item) => {
                let thumbnailSrc = item.thumbnail_url || item.url;
                if (item.type.includes("youtube") && !item.thumbnail_url) {
                  const match = item.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]+)/);
                  if (match) thumbnailSrc = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
                }

                return (
                  <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden glass-panel">
                    <img
                      src={thumbnailSrc}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      {item.type.includes("youtube") && (
                        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center shadow-lg">
                          <FaIcon icon={faPlay} className="w-5 h-5 text-black ms-1" />
                        </div>
                      )}
                      <h4 className="text-white font-semibold line-clamp-1">{item.title}</h4>
                    </div>
                    {item.type.includes("youtube") && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="absolute inset-0 z-10">
                        <span className="sr-only">مشاهدة الفيديو</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ═══════════════ RELATED SERVICES ═══════════════ */}
      {otherServices && otherServices.length > 0 && (
        <section className="py-20 border-t border-border/30">
          <div className="container-wide px-6">
            <AnimatedSection animation="fade-up" delay={0.1} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">خدمات أخرى قد تهمك</h2>
              <p className="text-muted-foreground">تصفح بقية خدماتنا المتخصصة في تجهيز الفعاليات</p>
            </AnimatedSection>
            <AnimatedSection animation="stagger-children" delay={0.2} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group card-interactive"
                >
                  <div className="h-32 -mx-6 -mt-6 mb-4 bg-gradient-to-br from-surface-container-high to-surface-container overflow-hidden flex items-center justify-center rounded-t-2xl">
                    {s.main_image_url ? (
                      <img src={s.main_image_url} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <FaIcon icon={faImage} className="w-8 h-8 text-primary/20" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm mb-1">{s.name}</h3>
                    {s.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-20 relative overflow-hidden border-t border-border/30 flex justify-center">
        <ParallaxLayer speed={-0.3} className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5" />
        </ParallaxLayer>
        <div className="container-narrow px-6 relative z-10 text-center">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              هل تتطلع لاستئجار <span className="text-primary">{service.name}</span>؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              تواصل معنا لنضع لك خطة تجهيز مخصصة تناسب احتياجات فعاليتك
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="scale-in" delay={0.2}>
            <MagneticButton strength={0.2}>
              <Link
                href="/request-quote"
                className="btn-cta"
              >
                اطلب عرض سعر مجاناً
                <FaIcon icon={faArrowLeft} className="w-5 h-5 arrow-navigate" />
              </Link>
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
