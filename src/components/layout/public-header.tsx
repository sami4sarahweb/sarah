"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "الخدمات", href: "/services" },
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
  }, [pathname]);

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
              {/* Synthetic Pulse glowing orb effect */}
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/40 rounded-full blur-[8px] group-hover:bg-primary/60 transition-colors duration-500"></div>
                <div className="w-3 h-3 bg-primary rounded-full relative z-10 shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                Synthetic Pulse
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? "text-primary" : "text-foreground/80"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Quick Actions */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              
              <div className="h-6 w-[1px] bg-border mx-1"></div>

              {/* Call */}
              <a 
                href="tel:+966500000000" 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-high border border-border/50 text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-300 hover:scale-105"
                aria-label="اتصل بنا"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/966500000000" 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-black hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] transition-all duration-300 font-semibold text-sm hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-3 relative z-10">
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
        className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-40 md:hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-24 pb-8 px-6">
          <nav className="flex flex-col gap-6 flex-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`text-2xl font-bold transition-colors ${
                    isActive ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-4 mt-auto">
            <a 
              href="https://wa.me/966500000000" 
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full h-14 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-black transition-all duration-300 font-bold text-lg"
            >
              <MessageCircle className="w-6 h-6" />
              تواصل عبر الواتساب
            </a>
            <a 
              href="tel:+966500000000" 
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
