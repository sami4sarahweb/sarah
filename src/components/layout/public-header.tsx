"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageCircle, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { PublicSiteData } from "@/lib/queries/public-data";

interface PublicHeaderProps {
  siteData: PublicSiteData;
}

export function PublicHeader({ siteData }: PublicHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { phone, whatsapp, services } = siteData;

  const phoneHref = phone ? `tel:+${phone.replace(/^0+/, "")}` : "#";
  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/^0+/, "")}`
    : "#";

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "المشاريع", href: "/projects" },
    { label: "المعرض", href: "/gallery" },
    { label: "تواصل معنا", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Close services dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 py-3 shadow-lg"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="relative z-10 flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/40 rounded-full blur-[8px] group-hover:bg-primary/60 transition-colors duration-500"></div>
                <div className="w-3 h-3 bg-primary rounded-full relative z-10 shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                مؤسسة سارة السهلي
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {/* Home link */}
              <NavLink href="/" label="الرئيسية" pathname={pathname} />

              {/* Services Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className={`relative text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 cursor-pointer ${
                    pathname.startsWith("/services") ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  الخدمات
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                  {pathname.startsWith("/services") && (
                    <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]"></span>
                  )}
                </button>

                {/* Dropdown Panel */}
                <div
                  className={`absolute top-full right-0 mt-4 w-72 rounded-xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden transition-all duration-200 origin-top ${
                    servicesOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="p-2 max-h-80 overflow-y-auto custom-scrollbar">
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="block px-4 py-2.5 rounded-lg text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-border/50 p-2">
                    <Link
                      href="/services"
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                    >
                      عرض جميع الخدمات
                    </Link>
                  </div>
                </div>
              </div>

              {/* Remaining nav links */}
              {navLinks.slice(1).map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} pathname={pathname} />
              ))}
            </nav>

            {/* Desktop Quick Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />

              <div className="h-6 w-[1px] bg-border mx-1"></div>

              {/* Call */}
              <a
                href={phoneHref}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-high border border-border/50 text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-300 hover:scale-105"
                aria-label="اتصل بنا"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-black hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] transition-all duration-300 font-semibold text-sm hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden items-center gap-3 relative z-10">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-md text-foreground hover:bg-surface-container-high transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-40 lg:hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-24 pb-8 px-6 overflow-y-auto">
          <nav className="flex flex-col gap-4 flex-1">
            <MobileNavLink href="/" label="الرئيسية" pathname={pathname} />

            {/* Services Accordion */}
            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className={`flex items-center justify-between w-full text-2xl font-bold transition-colors ${
                  pathname.startsWith("/services") ? "text-primary" : "text-foreground"
                }`}
              >
                الخدمات
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  mobileServicesOpen ? "max-h-[500px] mt-3" : "max-h-0"
                }`}
              >
                <div className="flex flex-col gap-1 pr-4 border-r-2 border-primary/30">
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="text-base text-muted-foreground hover:text-primary py-1.5 transition-colors"
                    >
                      {service.name}
                    </Link>
                  ))}
                  <Link
                    href="/services"
                    className="text-base font-semibold text-primary py-1.5"
                  >
                    عرض جميع الخدمات ←
                  </Link>
                </div>
              </div>
            </div>

            <MobileNavLink href="/projects" label="المشاريع" pathname={pathname} />
            <MobileNavLink href="/gallery" label="المعرض" pathname={pathname} />
            <MobileNavLink href="/contact" label="تواصل معنا" pathname={pathname} />
          </nav>

          <div className="flex flex-col gap-4 mt-auto">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full h-14 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-black transition-all duration-300 font-bold text-lg"
            >
              <MessageCircle className="w-6 h-6" />
              تواصل عبر الواتساب
            </a>
            <a
              href={phoneHref}
              className="flex items-center justify-center gap-3 w-full h-14 rounded-xl bg-surface-container-high border border-border text-foreground hover:bg-primary hover:text-black transition-all duration-300 font-bold text-lg"
            >
              <Phone className="w-6 h-6" />
              اتصال مباشر
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`relative text-sm font-medium transition-colors hover:text-primary ${
        isActive ? "text-primary" : "text-foreground/80"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]"></span>
      )}
    </Link>
  );
}

function MobileNavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`text-2xl font-bold transition-colors ${
        isActive ? "text-primary" : "text-foreground hover:text-primary"
      }`}
    >
      {label}
    </Link>
  );
}
