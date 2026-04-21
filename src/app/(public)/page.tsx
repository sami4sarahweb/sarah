import Link from "next/link";
import { Sparkles, MoveLeft, Star, Play, ArrowLeft, Diamond, Quote } from "lucide-react";
import { getHomePageData } from "@/lib/queries/home-data";
import { GalleryClient } from "./gallery-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مؤسسة سارة السهلي | تأجير لوازم المناسبات والحفلات بالرياض",
  description: "الوجهة الأولى لتأجير أفخم التجهيزات الحدثية في الرياض. خيام أوروبية، كنب VIP، جلسات خارجية، كوش أفراح، إضاءة، وأكثر من 16 خدمة متخصصة.",
  openGraph: {
    title: "مؤسسة سارة السهلي | تأجير لوازم المناسبات والحفلات بالرياض",
    description: "الوجهة الأولى لتأجير أفخم التجهيزات الحدثية في الرياض.",
    type: "website",
    locale: "ar_SA",
  },
};

export default async function PublicHomePage() {
  const { services, projects, testimonials, gallery } = await getHomePageData();

  return (
    <div className="flex flex-col">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-primary/20 rounded-[100%] blur-[120px] mix-blend-screen opacity-60 animate-pulse"></div>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px] opacity-40"></div>
        </div>

        <div className="container relative z-20 mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary tracking-wide">تصميم بلا حدود لفعالياتك القادمة</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground max-w-5xl mx-auto leading-tight">
            تجهيزات فاخرة تصنع{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]">
              اللحظة
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            الوجهة الأولى لتأجير أحدث التجهيزات والمنظومات الحدثية. من المعارض الكبرى إلى المناسبات الخاصة، نحن نبني لك مسرح أحلامك بأرقى المواصفات.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(var(--primary),0.4)] flex items-center justify-center gap-3 group"
            >
              استكشف خدماتنا
              <MoveLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
            </Link>
            <Link
              href="/request-quote"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface-container-high border border-border/50 text-foreground font-bold text-lg transition-all duration-300 hover:bg-white/5 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary),0.1)] flex items-center justify-center"
            >
              اطلب عرض سعر
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ TRUST METRICS ═══════════════ */}
      <section className="relative py-16 border-t border-border/30 bg-surface-container/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "500+", label: "فعالية منجزة" },
              { value: "50+", label: "شريك نجاح" },
              { value: "16", label: "خدمة متخصصة" },
              { value: "10K+", label: "قطعة تأجير" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-2 p-6 glass-panel rounded-2xl hover:border-primary/50 transition-colors duration-500">
                <span className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</span>
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES ═══════════════ */}
      {services.length > 0 && (
        <section className="py-24 relative overflow-hidden" id="services-section">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">ما نقدمه لك</span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">خدماتنا المتخصصة</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">مجموعة شاملة من خدمات التأجير والتجهيز لجعل فعاليتك لا مثيل لها</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group relative glass-panel rounded-2xl overflow-hidden p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(var(--primary),0.1)] cursor-pointer"
                >
                  {/* Service image or gradient placeholder */}
                  <div className="w-full h-32 rounded-xl mb-5 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    {service.main_image_url ? (
                      <img
                        src={service.main_image_url}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <Diamond className="w-8 h-8 text-primary/40 group-hover:text-primary/70 transition-colors" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{service.description}</p>
                  )}
                  <div className="flex items-center gap-1 mt-4 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    تفاصيل الخدمة
                    <MoveLeft className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300 font-semibold group"
              >
                عرض جميع الخدمات
                <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ PROJECTS ═══════════════ */}
      {projects.length > 0 && (
        <section className="py-24 bg-surface-container/30 border-t border-border/30 relative" id="projects-section">
          <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">إنجازاتنا</span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">مشاريع أنجزناها</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">نفخر بتنفيذ فعاليات لأبرز الشركات والجهات في المملكة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="group glass-panel rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300">
                  {/* Project image */}
                  <div className="w-full h-48 bg-gradient-to-br from-surface-container-high to-surface-container flex items-center justify-center overflow-hidden">
                    {project.main_image_url ? (
                      <img
                        src={project.main_image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Diamond className="w-12 h-12 text-primary/20" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                      {project.testimonial_rating && (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: project.testimonial_rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                          ))}
                        </div>
                      )}
                    </div>
                    {project.client_name && (
                      <p className="text-sm text-primary font-medium mb-2">{project.client_name}</p>
                    )}
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    )}
                    {project.slug && (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 mt-4 text-sm text-primary font-semibold hover:underline group/link"
                      >
                        عرض التفاصيل
                        <MoveLeft className="w-3 h-3 transition-transform group-hover/link:-translate-x-1" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300 font-semibold group"
              >
                عرض جميع المشاريع
                <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      {testimonials.length > 0 && (
        <section className="py-24 relative overflow-hidden" id="testimonials-section">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">آراء عملائنا</span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">ثقة عملائنا فخرنا</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">شهادات حقيقية من عملائنا الذين نفخر بخدمتهم</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((t) => (
                <div key={t.id} className="glass-panel rounded-2xl p-8 relative hover:border-primary/30 transition-colors duration-300">
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />
                  <p className="text-foreground leading-relaxed mb-6 text-sm md:text-base">
                    {t.testimonial_text}
                  </p>
                  <div className="flex items-center justify-between border-t border-border/50 pt-4">
                    <div>
                      <p className="font-bold text-foreground">{t.client_name}</p>
                      <p className="text-xs text-muted-foreground">{t.title}</p>
                    </div>
                    {t.testimonial_rating && (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: t.testimonial_rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ GALLERY ═══════════════ */}
      {gallery.length > 0 && (
        <section className="py-24 bg-surface-container/30 border-t border-border/30 relative" id="gallery-section">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">من أعمالنا</span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">معرض الصور والفيديو</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">لقطات حقيقية من فعاليات ومناسبات قمنا بتجهيزها</p>
            </div>

            <GalleryClient items={gallery} />

            <div className="flex justify-center mt-12">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300 font-semibold group"
              >
                عرض المعرض الكامل
                <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-8">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 max-w-3xl mx-auto leading-tight">
            جاهز لتحويل فعاليتك إلى تجربة <span className="text-primary">لا تُنسى</span>؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            تواصل معنا الآن واحصل على عرض سعر مخصص لفعاليتك. فريقنا المتخصص بانتظارك.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/request-quote"
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(var(--primary),0.5)] flex items-center justify-center gap-3"
            >
              اطلب عرض سعر مجاناً
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link
              href="/services"
              className="w-full sm:w-auto px-10 py-4 rounded-xl border border-border hover:border-primary/50 text-foreground font-bold text-lg transition-all duration-300 hover:text-primary flex items-center justify-center"
            >
              تصفح الخدمات
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
