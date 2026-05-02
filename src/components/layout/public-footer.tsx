"use client";

import Link from "next/link";
import { FaIcon } from "@/components/ui/fa-icon";
import { faPhone, faEnvelope, faLocationDot, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faYoutube, faInstagram, faFacebook, faXTwitter, faTiktok } from "@fortawesome/free-brands-svg-icons";
import type { PublicSiteData } from "@/lib/queries/public-data";
import { RevealOnScroll } from "@/components/animations/reveal-on-scroll";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// Match DB platforms to FA brand icons
const socialIcons: Record<string, IconDefinition> = {
  youtube: faYoutube,
  instagram: faInstagram,
  facebook: faFacebook,
  twitter: faXTwitter,
  tiktok: faTiktok,
};

interface PublicFooterProps {
  siteData: PublicSiteData;
}

export function PublicFooter({ siteData }: PublicFooterProps) {
  const currentYear = new Date().getFullYear();
  const { phone, email, socials, services } = siteData;

  const phoneFormatted = phone
    ? `+${phone.replace(/^0+/, "").replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4")}`
    : "";

  return (
    <footer className="relative bg-surface-container overflow-hidden pt-20 pb-10 border-t border-border/50">
      {/* Background elements */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-[100%] blur-[100px] pointer-events-none"></div>

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <RevealOnScroll delay={0} className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative w-20 h-20 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo_light.png"
                  alt="مؤسسة سارة السهلي"
                  className="w-full h-full object-contain block dark:hidden"
                />
                <img
                  src="/logo_dark.png"
                  alt="مؤسسة سارة السهلي"
                  className="w-full h-full object-contain hidden dark:block"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                مؤسسة سارة السهلي
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm">
              شريكك الاستراتيجي في تجهيز أفضل الفعاليات والمناسبات الكبرى، حيث الإبداع والفخامة يجتمعان لتقديم لحظات لا تُنسى.
            </p>

            {/* Social Icons — from DB */}
            {socials.length > 0 && (
              <div className="flex items-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.value}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 hover-lift cursor-pointer focus-ring-primary"
                    aria-label={social.platform ?? "social"}
                  >
                    {social.platform && socialIcons[social.platform.toLowerCase()] ? (
                      <FaIcon icon={socialIcons[social.platform.toLowerCase()]} className="w-4 h-4" />
                    ) : (
                      <div className="w-2 h-2 rounded-full border border-current"></div>
                    )}
                  </a>
                ))}
              </div>
            )}
          </RevealOnScroll>

          {/* Quick Links */}
          <RevealOnScroll delay={0.1} className="flex flex-col gap-6">
            <h3 className="text-lg font-bold text-foreground">روابط سريعة</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group text-sm w-fit focus-ring-primary rounded-sm">
                  <FaIcon icon={faArrowLeft} className="w-3 h-3 arrow-navigate transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" /> الخدمات التأجيرية
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group text-sm w-fit focus-ring-primary rounded-sm">
                  <FaIcon icon={faArrowLeft} className="w-3 h-3 arrow-navigate transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" /> المشاريع السابقة
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group text-sm w-fit focus-ring-primary rounded-sm">
                  <FaIcon icon={faArrowLeft} className="w-3 h-3 arrow-navigate transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" /> معرض الصور
                </Link>
              </li>
              <li>
                <Link href="/request-quote" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group text-sm w-fit focus-ring-primary rounded-sm">
                  <FaIcon icon={faArrowLeft} className="w-3 h-3 arrow-navigate transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" /> طلب عرض سعر
                </Link>
              </li>
            </ul>
          </RevealOnScroll>

          {/* Services — from DB */}
          <RevealOnScroll delay={0.2} className="flex flex-col gap-6">
            <h3 className="text-lg font-bold text-foreground">أبرز خدماتنا</h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2 group w-fit focus-ring-primary rounded-sm"
                  >
                    <FaIcon icon={faArrowLeft} className="w-3 h-3 arrow-navigate transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </RevealOnScroll>

          {/* Contact — from DB */}
          <RevealOnScroll delay={0.3} className="flex flex-col gap-6">
            <h3 className="text-lg font-bold text-foreground">تواصل معنا</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <FaIcon icon={faLocationDot} className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>المملكة العربية السعودية، الرياض</span>
              </li>
              {phone && (
                <li className="flex items-center gap-3 text-sm">
                  <FaIcon icon={faPhone} className="w-4 h-4 text-primary shrink-0" />
                  <a
                    href={`tel:+${phone.replace(/^0+/, "")}`}
                    className="text-muted-foreground hover:text-primary transition-colors focus-ring-primary rounded-sm"
                    dir="ltr"
                  >
                    {phoneFormatted}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3 text-sm">
                  <FaIcon icon={faEnvelope} className="w-4 h-4 text-primary shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="text-muted-foreground hover:text-primary transition-colors focus-ring-primary rounded-sm"
                  >
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </RevealOnScroll>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>جميع الحقوق محفوظة &copy; {currentYear} مؤسسة سارة السهلي.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors focus-ring-primary rounded-sm">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-primary transition-colors focus-ring-primary rounded-sm">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
