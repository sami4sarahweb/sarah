import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Phone, Play, Image as ImageIcon, MoveLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

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
    .select("*, service_properties(*), service_media(*, gallery_media(*))")
    .eq("slug", slug)
    .single();

  if (!service || !service.is_active) {
    notFound();
  }

  const properties = [...(service.service_properties as ServiceProperty[] || [])].sort(
    (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
  );

  const mediaItems = [...(service.service_media as MediaJoin[] || [])]
    .filter((m) => m.gallery_media)
    .sort((a, b) => 0)
    .map((m) => m.gallery_media!);

  return (
    <div className="min-h-screen bg-background">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {service.cover_image_url ? (
            <img src={service.cover_image_url} alt={service.name} className="w-full h-full object-cover opacity-20 blur-sm" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium mb-8"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للخدمات
          </Link>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div className="flex-1 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-wide">
                تجهيز و تأجير
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {service.name}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {service.description}
              </p>
              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  href="/request-quote"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold transition-all duration-300 hover:scale-105 shadow-[0_0_25px_rgba(var(--primary),0.4)]"
                >
                  <Phone className="w-5 h-5" />
                  احجز الآن
                </Link>
                <a
                  href="#properties"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border hover:border-primary/50 text-foreground hover:text-primary font-bold transition-all duration-300"
                >
                  تفاصيل الخدمة
                  <MoveLeft className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Main Image */}
            <div className="w-full lg:w-5/12 shrink-0">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-surface-container-high border border-border/30 shadow-2xl group">
                {service.main_image_url ? (
                  <img src={service.main_image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-muted-foreground/20" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ DETAILS & PROPERTIES ═══════════════ */}
      <section className="py-20 bg-surface-container/30 border-t border-border/30" id="properties">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Details */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">الشرح والتفاصيل</h2>
              <div className="w-16 h-1 bg-primary rounded-full"></div>
              <div className="text-muted-foreground leading-loose whitespace-pre-line text-base">
                {service.details || service.description || "لا يوجد تفاصيل إضافية مسجلة لهذه الخدمة."}
              </div>
            </div>

            {/* Properties */}
            {properties.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">ما يشمل هذه الخدمة</h3>
                <div className="flex flex-col gap-4">
                  {properties.map((prop) => (
                    <div
                      key={prop.id}
                      className="flex items-start gap-4 p-5 rounded-2xl glass-panel hover:border-primary/30 transition-all duration-300"
                    >
                      <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-foreground text-lg">{prop.name}</h4>
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

      {/* ═══════════════ MEDIA GALLERY ═══════════════ */}
      {mediaItems.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">معرض الخدمة</h2>
              <p className="text-muted-foreground">تصفح صور وفيديوهات لأعمالنا السابقة</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-6 h-6 text-black fill-black mr-[-2px]" />
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
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-20 relative overflow-hidden border-t border-border/30">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            هل تتطلع لاستئجار <span className="text-primary">{service.name}</span>؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            تواصل معنا لنضع لك خطة تجهيز مخصصة تناسب احتياجات فعاليتك
          </p>
          <Link
            href="/request-quote"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold text-lg transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(var(--primary),0.5)]"
          >
            اطلب عرض سعر مجاناً
            <MoveLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
