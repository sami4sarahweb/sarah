import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MoveLeft, CheckCircle2, Diamond, ArrowLeft, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "خدماتنا المتخصصة | مؤسسة سارة السهلي لتأجير لوازم المناسبات",
  description: "أكثر من 16 خدمة متخصصة في تأجير وتجهيز الفعاليات والمناسبات. خيام أوروبية، كنب VIP، جلسات خارجية، كوش أفراح، إضاءة، أرضيات، مسارح، ومولدات كهربائية.",
};

interface ServiceProperty {
  id: string;
  name: string;
  description: string | null;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  details: string | null;
  main_image_url: string | null;
  cover_image_url: string | null;
  icon_name: string | null;
  service_properties: ServiceProperty[];
}

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("services")
    .select("id, name, slug, description, details, main_image_url, cover_image_url, icon_name, service_properties(id, name, description)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const services = (data ?? []) as Service[];

  return (
    <div className="min-h-screen bg-background">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-primary/15 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px] opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">الخبرة تصنع الفرق</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              كل خدمة… <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">قصة نجاح</span> جديدة
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              نقدم لكم أكثر من <strong className="text-foreground">16 خدمة متخصصة</strong> في عالم تأجير وتجهيز الفعاليات. كل خدمة صُممت بعناية فائقة لتحويل فكرتكم إلى واقعٍ يفوق التوقعات.
            </p>

            {/* Quick jump nav */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
              {services.slice(0, 8).map((s) => (
                <a
                  key={s.id}
                  href={`#service-${s.slug}`}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                >
                  {s.name}
                </a>
              ))}
              {services.length > 8 && (
                <span className="text-xs text-muted-foreground">+{services.length - 8} أخرى</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STORYTELLING SERVICES ═══════════════ */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            const imageUrl = service.cover_image_url || service.main_image_url;

            return (
              <article
                key={service.id}
                id={`service-${service.slug}`}
                className="scroll-mt-24"
              >
                {/* Section divider with number */}
                <div className="flex items-center gap-4 mb-12 mt-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-lg">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-border to-transparent"></div>
                </div>

                {/* Content row */}
                <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 lg:gap-16 items-center mb-24`}>
                  
                  {/* Image / Visual Side */}
                  <div className="w-full lg:w-5/12 shrink-0">
                    <div className="relative group">
                      <div className={`absolute -inset-3 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isEven ? "" : "from-transparent to-primary/20"}`}></div>
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface-container-high border border-border/30">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-surface-container to-surface-container-high">
                            <Diamond className="w-16 h-16 text-primary/20" />
                            <span className="text-sm text-muted-foreground/50">{service.name}</span>
                          </div>
                        )}
                        {/* Floating badge */}
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-xs font-medium text-primary">
                          {service.service_properties.length} خاصية
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text / Story Side */}
                  <div className="w-full lg:w-7/12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                      {service.name}
                    </h2>
                    {service.description && (
                      <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        {service.description}
                      </p>
                    )}
                    {service.details && (
                      <p className="text-base text-muted-foreground/80 leading-relaxed mb-6">
                        {service.details}
                      </p>
                    )}

                    {/* Properties as features */}
                    {service.service_properties.length > 0 && (
                      <div className="space-y-3 mb-8">
                        <h3 className="text-sm font-semibold text-primary tracking-wider uppercase mb-4">ما يشملها</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {service.service_properties.map((prop) => (
                            <div
                              key={prop.id}
                              className="flex items-start gap-3 p-3 rounded-xl bg-surface-container/50 border border-border/30 hover:border-primary/30 transition-colors group/prop"
                            >
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                              <div>
                                <span className="text-sm font-medium text-foreground">{prop.name}</span>
                                {prop.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{prop.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-black font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(var(--primary),0.3)] group/btn"
                      >
                        تفاصيل الخدمة
                        <MoveLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                      </Link>
                      <Link
                        href="/request-quote"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-primary/50 text-foreground hover:text-primary font-semibold transition-all duration-300"
                      >
                        اطلب عرض سعر
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section className="py-24 relative overflow-hidden border-t border-border/30">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 max-w-2xl mx-auto">
            لم تجد ما تبحث عنه؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            تواصل معنا وأخبرنا بتفاصيل فعاليتك. فريقنا المتخصص سيقدم لك الحل الأمثل والعرض المناسب.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/request-quote"
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold text-lg transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(var(--primary),0.5)] flex items-center justify-center gap-3"
            >
              اطلب عرض سعر مجاناً
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link
              href="/projects"
              className="w-full sm:w-auto px-10 py-4 rounded-xl border border-border hover:border-primary/50 text-foreground hover:text-primary font-bold text-lg transition-all duration-300 flex items-center justify-center"
            >
              شاهد مشاريعنا
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
