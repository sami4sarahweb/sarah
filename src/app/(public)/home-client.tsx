"use client";

import Link from "next/link";
import { FaIcon } from "@/components/ui/fa-icon";
import {
  faStar,
  faArrowLeft,
  faQuoteRight,
  faHandshake,
  faCogs,
  faWandMagic,
  faGem
} from "@fortawesome/free-solid-svg-icons";
import { GalleryClient } from "./gallery-client";
import { AnimatedSection } from "@/components/animations/animated-section";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { ParallaxLayer } from "@/components/animations/parallax-layer";

type HomePageData = {
  services: any[];
  projects: any[];
  testimonials: any[];
  gallery: any[];
};

export function HomeClient({ data }: { data: HomePageData }) {
  const { services, projects, testimonials, gallery } = data;

  return (
    <div className="flex flex-col">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* --- Background layers --- */}
        <div className="absolute inset-0 z-0">
          {/* Main glow orb */}
          <ParallaxLayer speed={-0.3} className="w-full h-full">
            <div className="absolute top-[15%] start-[50%] -translate-x-1/2 rtl:translate-x-1/2 w-[min(90vw,900px)] h-[min(90vw,900px)] rounded-full bg-primary/25 blur-[160px] mix-blend-screen animate-pulse-glow" />
          </ParallaxLayer>
          {/* Secondary accent orb */}
          <div className="absolute bottom-[10%] start-[15%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[120px] animate-float pointer-events-none" />
          {/* Top-right accent */}
          <div className="absolute top-[5%] end-[10%] w-[300px] h-[300px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />
          {/* Dot grid pattern */}
          <div className="absolute inset-0 bg-dots opacity-30" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
          {/* Decorative rings */}
          <div className="absolute top-1/2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/5 pointer-events-none" />
          <div className="absolute top-1/2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/[0.03] pointer-events-none" />
        </div>

        {/* --- Content --- */}
        <div className="container-wide relative z-20 text-center flex flex-col items-center px-6">
          {/* Badge */}
          <RevealOnScroll direction="down" delay={0.1}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-panel border border-primary/20 mb-10 hover-glow cursor-default">
              <FaIcon icon={faWandMagic} className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary/90 tracking-wide">تصميم بلا حدود لفعالياتك القادمة</span>
            </div>
          </RevealOnScroll>

          {/* Main heading — gradient text rendered directly, NOT via AnimatedText */}
          <AnimatedSection animation="fade-up" delay={0.15}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-foreground max-w-5xl mx-auto leading-[1.15]">
              تجهيزات فاخرة تصنع{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary via-primary/80 to-primary/50 drop-shadow-[0_0_30px_rgba(var(--primary),0.4)]">
                اللحظة
              </span>
            </h1>
          </AnimatedSection>

          {/* Subtitle */}
          <AnimatedSection animation="fade-up" delay={0.35} className="max-w-2xl mx-auto mb-14">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              الوجهة الأولى لتأجير أحدث التجهيزات والمنظومات الحدثية. من المعارض الكبرى إلى المناسبات الخاصة، نحن نبني لك مسرح أحلامك بأرقى المواصفات.
            </p>
          </AnimatedSection>

          {/* CTA buttons */}
          <AnimatedSection animation="fade-up" delay={0.55}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <MagneticButton strength={0.15} className="w-full sm:w-auto">
                <Link
                  href="/services"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-primary hover:bg-primary-hover text-black font-bold text-lg transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_40px_rgba(var(--primary),0.35)] hover:shadow-[0_0_60px_rgba(var(--primary),0.5)]"
                >
                  استكشف خدماتنا
                  <FaIcon icon={faArrowLeft} className="w-5 h-5 arrow-navigate" />
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.1} className="w-full sm:w-auto">
                <Link
                  href="/request-quote"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl border border-border/60 glass-panel text-foreground font-bold text-lg transition-all duration-300 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_30px_rgba(var(--primary),0.12)]"
                >
                  اطلب عرض سعر
                </Link>
              </MagneticButton>
            </div>
          </AnimatedSection>

          {/* Trust micro-indicators under buttons */}
          <AnimatedSection animation="fade-up" delay={0.75} className="mt-12">
            <div className="flex items-center justify-center gap-6 text-muted-foreground/60 text-sm">
              <span className="flex items-center gap-1.5">
                <FaIcon icon={faStar} className="w-3.5 h-3.5 text-primary/50" />
                <span>+500 فعالية</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5">
                <FaIcon icon={faHandshake} className="w-3.5 h-3.5 text-primary/50" />
                <span>+50 شريك</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5">
                <FaIcon icon={faCogs} className="w-3.5 h-3.5 text-primary/50" />
                <span>16 خدمة</span>
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ SERVICES ═══════════════ */}
      {services.length > 0 && (
        <section className="py-20 md:py-28 relative overflow-hidden" id="services-section">
          {/* Background accent */}
          <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="container-wide relative z-10">
            {/* Section header */}
            <AnimatedSection animation="fade-up" className="text-center mb-16">
              <span className="section-label">ما نقدمه لك</span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">خدماتنا المتخصصة</h2>
              <p className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed">مجموعة شاملة من خدمات التأجير والتجهيز لجعل فعاليتك لا مثيل لها</p>
            </AnimatedSection>

            {/* Service cards — CSS Grid for consistent sizing */}
            <AnimatedSection animation="fade-up" delay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group glass-panel rounded-2xl overflow-hidden hover-lift hover-border-glow cursor-pointer flex flex-col"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
                    {service.main_image_url ? (
                      <img
                        src={service.main_image_url}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[600ms] ease-out"
                      />
                    ) : (
                      <FaIcon name={service.icon_name} className="w-12 h-12 text-primary/40 group-hover:text-primary/70 transition-colors duration-300" />
                    )}
                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{service.description}</p>
                    )}
                    <div className="mt-auto flex items-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      تفاصيل الخدمة
                      <FaIcon icon={faArrowLeft} className="w-3.5 h-3.5 rtl:-scale-x-100" />
                    </div>
                  </div>
                </Link>
              ))}
            </AnimatedSection>

            {/* View all link */}
            <AnimatedSection animation="fade-up" delay={0.2} className="flex justify-center mt-14">
              <MagneticButton strength={0.3}>
                <Link href="/services" className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl border border-border/60 glass-panel text-foreground font-semibold transition-all duration-300 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                  عرض جميع الخدمات
                  <FaIcon icon={faArrowLeft} className="w-4 h-4 arrow-navigate" />
                </Link>
              </MagneticButton>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ═══════════════ PROJECTS ═══════════════ */}
      {projects.length > 0 && (
        <section className="py-20 md:py-28 bg-surface-container/30 border-t border-border/30 relative" id="projects-section">
          {/* Background accent */}
          <div className="absolute bottom-0 start-0 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="container-wide relative z-10">
            {/* Section header */}
            <AnimatedSection animation="fade-up" className="text-center mb-16">
              <span className="section-label">إنجازاتنا</span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">مشاريع أنجزناها</h2>
              <p className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed">نفخر بتنفيذ فعاليات لأبرز الشركات والجهات في المملكة</p>
            </AnimatedSection>

            {/* Project cards */}
            <AnimatedSection animation="fade-up" delay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="group glass-panel rounded-2xl overflow-hidden hover-border-glow transition-all duration-300 hover-lift flex flex-col">
                  {/* Image */}
                  <div className="relative w-full aspect-video bg-gradient-to-br from-surface-container-high to-surface-container flex items-center justify-center overflow-hidden">
                    {project.main_image_url ? (
                      <img
                        src={project.main_image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <FaIcon icon={faGem} className="w-12 h-12 text-primary/20" />
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3 gap-4">
                      <h3 className="text-xl font-bold text-foreground leading-snug">{project.title}</h3>
                      {project.testimonial_rating && (
                        <div className="flex items-center gap-1 shrink-0 mt-1">
                          {Array.from({ length: project.testimonial_rating }).map((_, i) => (
                            <FaIcon key={i} icon={faStar} className="w-3.5 h-3.5 text-primary" />
                          ))}
                        </div>
                      )}
                    </div>
                    {project.client_name && (
                      <p className="text-sm text-primary font-bold mb-3">{project.client_name}</p>
                    )}
                    {project.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5">{project.description}</p>
                    )}
                    {project.slug && (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="mt-auto inline-flex items-center gap-2 text-sm text-primary font-bold hover:underline w-fit"
                      >
                        عرض التفاصيل
                        <FaIcon icon={faArrowLeft} className="w-3 h-3 rtl:-scale-x-100" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </AnimatedSection>

            {/* View all */}
            <AnimatedSection animation="fade-up" delay={0.2} className="flex justify-center mt-14">
              <MagneticButton strength={0.3}>
                <Link href="/projects" className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl border border-border/60 glass-panel text-foreground font-semibold transition-all duration-300 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                  عرض جميع المشاريع
                  <FaIcon icon={faArrowLeft} className="w-4 h-4 arrow-navigate" />
                </Link>
              </MagneticButton>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-28 relative overflow-hidden" id="testimonials-section">
          <div className="absolute top-1/2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

          <div className="container-wide relative z-10">
            {/* Section header */}
            <AnimatedSection animation="fade-up" className="text-center mb-16">
              <span className="section-label">آراء عملائنا</span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">ثقة عملائنا فخرنا</h2>
              <p className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed">شهادات حقيقية من عملائنا الذين نفخر بخدمتهم</p>
            </AnimatedSection>

            <AnimatedSection animation="stagger-children" className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {testimonials.map((t) => (
                <div key={t.id} className="glass-panel rounded-2xl p-8 lg:p-10 relative hover:border-primary/40 transition-colors duration-300 flex flex-col">
                  <FaIcon icon={faQuoteRight} className="w-10 h-10 text-primary/15 mb-5" />
                  <p className="text-foreground leading-relaxed md:text-lg mb-8 flex-1 font-medium">
                    &ldquo;{t.testimonial_text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between border-t border-border/50 pt-6 mt-auto">
                    <div>
                      <p className="font-bold text-foreground text-lg">{t.client_name}</p>
                      {t.title && <p className="text-sm text-primary mt-1">{t.title}</p>}
                    </div>
                    {t.testimonial_rating && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: t.testimonial_rating }).map((_, i) => (
                          <FaIcon key={i} icon={faStar} className="w-4 h-4 text-primary" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ═══════════════ GALLERY ═══════════════ */}
      {gallery.length > 0 && (
        <section className="py-20 md:py-28 bg-surface-container/30 border-t border-border/30 relative" id="gallery-section">
          <div className="container-wide relative z-10">
            {/* Section header */}
            <AnimatedSection animation="fade-up" className="text-center mb-16">
              <span className="section-label">من أعمالنا</span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">معرض الصور والفيديو</h2>
              <p className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed">لقطات حقيقية من فعاليات ومناسبات قمنا بتجهيزها</p>
            </AnimatedSection>

            <div className="w-full relative z-10">
              <GalleryClient items={gallery} />
            </div>

            <AnimatedSection animation="fade-up" delay={0.2} className="flex justify-center mt-14">
              <MagneticButton strength={0.3}>
                <Link href="/gallery" className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl border border-border/60 glass-panel text-foreground font-semibold transition-all duration-300 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                  عرض المعرض الكامل
                  <FaIcon icon={faArrowLeft} className="w-4 h-4 arrow-navigate" />
                </Link>
              </MagneticButton>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5 pointer-events-none" />
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="container-wide relative z-10 text-center">
          <AnimatedSection animation="scale-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-8 mx-auto animate-pulse-glow">
              <FaIcon icon={faGem} className="w-8 h-8 text-primary animate-rotate-slow" />
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.15}>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 max-w-3xl mx-auto leading-tight">
              جاهز لتحويل فعاليتك إلى تجربة <span className="text-primary">لا تُنسى؟</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.3}>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              تواصل معنا الآن واحصل على عرض سعر مخصص لفعاليتك. فريقنا المتخصص بانتظارك.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.45}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <MagneticButton strength={0.3}>
                <Link href="/request-quote" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-primary hover:bg-primary-hover text-black font-bold text-lg transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_40px_rgba(var(--primary),0.35)] hover:shadow-[0_0_60px_rgba(var(--primary),0.5)]">
                  اطلب عرض سعر مجاناً
                  <FaIcon icon={faArrowLeft} className="w-5 h-5 arrow-navigate" />
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.2}>
                <Link href="/services" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl border border-border/60 glass-panel text-foreground font-bold text-lg transition-all duration-300 hover:border-primary/50 hover:text-primary">
                  تصفح الخدمات
                </Link>
              </MagneticButton>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
