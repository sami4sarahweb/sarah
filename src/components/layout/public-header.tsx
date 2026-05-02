"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import type { PublicSiteData } from "@/lib/queries/public-data";
import { FaIcon } from "@/components/ui/fa-icon";
import { faBars, faXmark, faPhone, faChevronDown, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getDirectionMultiplier } from "@/lib/animations/gsap-utils";

interface PublicHeaderProps {
  siteData: PublicSiteData;
}

export function PublicHeader({ siteData }: PublicHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
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

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // GSAP Animations
  useGSAP(() => {
    // Header entrance animation
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    }
  }, { scope: headerRef });

  // Dropdown animation
  useGSAP(() => {
    if (dropdownContentRef.current) {
      if (servicesOpen) {
        gsap.to(dropdownContentRef.current, {
          scaleY: 1,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
          display: "block",
          transformOrigin: "top"
        });
      } else {
        gsap.to(dropdownContentRef.current, {
          scaleY: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(dropdownContentRef.current, { display: "none" });
          }
        });
      }
    }
  }, [servicesOpen]);

  // Mobile Menu animation
  useGSAP(() => {
    if (mobileMenuRef.current) {
      const dirMap = getDirectionMultiplier();
      if (mobileMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          x: 0,
          duration: 0.5,
          ease: "power4.out"
        });
      } else {
        gsap.to(mobileMenuRef.current, {
          x: 100 * dirMap + "%",
          duration: 0.4,
          ease: "power3.in"
        });
      }
    }
  }, [mobileMenuOpen]);

  // Set initial state for mobile menu via direction multiplier
  useEffect(() => {
     if (mobileMenuRef.current && !mobileMenuOpen) {
        gsap.set(mobileMenuRef.current, { x: getDirectionMultiplier() > 0 ? "100%" : "-100%" })
     }
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 inset-x-0 w-full z-50 transition-colors duration-300 ${
          isScrolled
            ? "glass-navbar py-3 shadow-lg"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="relative z-10 flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/40 rounded-full blur-[8px] group-hover:bg-primary/60 transition-colors duration-500"></div>
                <div className="w-3 h-3 bg-primary rounded-full relative z-10 shadow-glow-sm animate-pulse-glow"></div>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                مؤسسة سارة السهلي
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-6">
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
                  <FaIcon 
                    icon={faChevronDown} 
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} 
                  />
                  {pathname.startsWith("/services") && (
                    <span className="absolute -bottom-1.5 inset-inline-0 h-[2px] bg-primary rounded-full shadow-glow-sm"></span>
                  )}
                </button>

                {/* Dropdown Panel */}
                <div
                  ref={dropdownContentRef}
                  style={{ display: 'none', transform: 'scaleY(0)', opacity: 0 }}
                  className="absolute top-full end-0 mt-4 w-72 rounded-xl glass-modal shadow-float overflow-hidden origin-top"
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
            <div className="hidden xl:flex items-center gap-3">
              <ThemeToggle />

              <div className="h-6 w-[1px] bg-border mx-1"></div>

              {/* Call */}
              <a
                href={phoneHref}
                className="btn-icon"
                aria-label="اتصل بنا"
              >
                <FaIcon icon={faPhone} className="w-4 h-4" />
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-black hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] transition-all duration-300 font-semibold text-sm hover-scale animate-float"
                style={{ animationDuration: '4s' }}
              >
                <FaIcon icon={faWhatsapp} className="w-4 h-4" />
                <span>واتساب</span>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex xl:hidden items-center gap-3 relative z-10">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-md text-foreground hover:bg-surface-container-high transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FaIcon icon={faXmark} className="w-5 h-5" /> : <FaIcon icon={faBars} className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40 xl:hidden"
        style={{ transform: "translateX(100%)" }} // Will be overridden by GSAP on mount based on RTL
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
                <FaIcon icon={faChevronDown} className={`w-5 h-5 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  mobileServicesOpen ? "max-h-[500px] mt-3" : "max-h-0"
                }`}
              >
                <div className="flex flex-col gap-1 pe-4 border-e-2 border-primary/30">
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
                    className="text-base font-semibold text-primary py-1.5 flex items-center gap-2"
                  >
                    عرض جميع الخدمات <FaIcon icon={faArrowLeft} className="arrow-navigate text-sm" />
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
              <FaIcon icon={faWhatsapp} className="w-6 h-6" />
              تواصل عبر الواتساب
            </a>
            <a
              href={phoneHref}
              className="flex items-center justify-center gap-3 w-full h-14 rounded-xl bg-surface-container-high border border-border text-foreground hover:bg-primary hover:text-black transition-all duration-300 font-bold text-lg"
            >
              <FaIcon icon={faPhone} className="w-6 h-6" />
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
        <span className="absolute -bottom-1.5 inset-inline-0 h-[2px] bg-primary rounded-full shadow-glow-sm"></span>
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
