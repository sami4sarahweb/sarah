import Link from "next/link";
import { MoveLeft, Phone, Mail, MapPin } from "lucide-react";
import type { PublicSiteData } from "@/lib/queries/public-data";

// Social platform SVG icons (brand icons not available in lucide-react)
const socialIcons: Record<string, React.ReactNode> = {
  youtube: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
  ),
  instagram: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
  ),
  facebook: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
  ),
  twitter: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
  ),
  tiktok: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
  ),
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

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center p-[2px]">
                <div className="w-full h-full bg-surface-container rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
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
                    className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    aria-label={social.platform ?? "social"}
                  >
                    {socialIcons[social.platform ?? ""] ?? (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold text-foreground">روابط سريعة</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                  <MoveLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> الخدمات التأجيرية
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                  <MoveLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> المشاريع السابقة
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                  <MoveLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> معرض الصور
                </Link>
              </li>
              <li>
                <Link href="/request-quote" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                  <MoveLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> طلب عرض سعر
                </Link>
              </li>
            </ul>
          </div>

          {/* Services — from DB */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold text-foreground">أبرز خدماتنا</h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2 group"
                  >
                    <MoveLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — from DB */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold text-foreground">تواصل معنا</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>المملكة العربية السعودية، الرياض</span>
              </li>
              {phone && (
                <li className="flex items-center gap-3 text-sm">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a
                    href={`tel:+${phone.replace(/^0+/, "")}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    dir="ltr"
                  >
                    {phoneFormatted}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3 text-sm">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>جميع الحقوق محفوظة &copy; {currentYear} مؤسسة سارة السهلي.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
