import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

import { FaIcon } from "@/components/ui/fa-icon";
import { faWandMagic, faCircleCheck, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AnimatedText } from "@/components/animations/animated-text";
import { AnimatedSection } from "@/components/animations/animated-section";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { ParallaxLayer } from "@/components/animations/parallax-layer";
import { MagneticButton } from "@/components/animations/magnetic-button";

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
    <div className="min-h-screen bg-background flex flex-col">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <ParallaxLayer speed={-0.2} className="w-full h-full">
            <div className="absolute top-[30%] start-[50%] -translate-x-1/2 rtl:translate-x-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-primary/15 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow" />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-dots opacity-30" />
        </div>

        <div className="container-wide relative z-10 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection animation="fade-up" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 mb-6 hover-glow">
                <FaIcon icon={faWandMagic} className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">الخبرة تصنع الفرق</span>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={0.15}>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                كل خدمة… <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">قصة نجاح</span> جديدة
              </h1>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={0.3}>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
                نقدم لكم أكثر من <strong className="text-foreground">{services.length || 16} خدمة متخصصة</strong> في عالم تأجير وتجهيز الفعاليات. كل خدمة صُممت بعناية فائقة لتحويل فكرتكم إلى واقعٍ يفوق التوقعات.
              </p>
            </AnimatedSection>

            {/* Quick jump nav */}
            <AnimatedSection animation="stagger-children" delay={0.4} className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
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
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════ STORYTELLING SERVICES ═══════════════ */}
      <section className="pb-20">
        <div className="container-wide px-6">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            const imageUrl = service.cover_image_url || service.main_image_url;

            return (
              <RevealOnScroll
                key={service.id}
                direction={isEven ? "inline-start" : "inline-end"}
                delay={0}
              >
                <article
                  id={`service-${service.slug}`}
                  className="scroll-mt-32"
                >
                  {/* Section divider with number */}
                  <div className="flex items-center gap-4 mb-12 mt-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-lg">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="flex-1 h-[1px] bg-gradient-to-l rtl:bg-gradient-to-r from-transparent via-border to-transparent"></div>
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
                              <FaIcon name={service.icon_name || "gem"} className="w-16 h-16 text-primary/20" />
                              <span className="text-sm text-muted-foreground/50">{service.name}</span>
                            </div>
                          )}
                          {/* Floating badge */}
                          <div className="absolute top-4 end-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-xs font-medium text-primary">
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
                                <FaIcon icon={faCircleCheck} className="w-5 h-5 text-primary shrink-0 mt-0.5" />
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
                        <MagneticButton strength={0.15}>
                          <Link
                            href={`/services/${service.slug}`}
                            className="btn-primary group/btn"
                          >
                            تفاصيل الخدمة
                            <FaIcon icon={faArrowLeft} className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1 rtl:group-hover/btn:translate-x-1" />
                          </Link>
                        </MagneticButton>
                        <MagneticButton strength={0.1}>
                          <Link
                            href="/request-quote"
                            className="btn-secondary"
                          >
                            اطلب عرض سعر
                          </Link>
                        </MagneticButton>
                      </div>
                    </div>
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section className="py-24 relative overflow-hidden border-t border-border/30 flex flex-col items-center">
        <ParallaxLayer speed={-0.3} className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5" />
        </ParallaxLayer>
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container-narrow px-6 relative z-10 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 max-w-2xl mx-auto">
              لم تجد ما تبحث عنه؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              تواصل معنا وأخبرنا بتفاصيل فعاليتك. فريقنا المتخصص سيقدم لك الحل الأمثل والعرض المناسب.
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={0.2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton strength={0.2} className="w-full sm:w-auto">
              <Link
                href="/request-quote"
                className="btn-cta w-full sm:w-auto"
              >
                اطلب عرض سعر مجاناً
                <FaIcon icon={faArrowLeft} className="w-5 h-5 arrow-navigate" />
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.1} className="w-full sm:w-auto">
              <Link
                href="/projects"
                className="btn-secondary w-full sm:w-auto"
              >
                شاهد مشاريعنا
              </Link>
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
