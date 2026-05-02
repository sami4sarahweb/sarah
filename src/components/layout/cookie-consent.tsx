"use client";

import { useState, useEffect, useRef } from "react";
import { FaIcon } from "@/components/ui/fa-icon";
import { faCookieBite, faXmark } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GSAP_DURATION } from "@/lib/animations/gsap-utils";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show if not previously accepted
    const consent = localStorage.getItem("synthetic_pulse_cookie_consent");
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useGSAP(() => {
    if (isVisible && containerRef.current) {
      gsap.from(containerRef.current, {
        y: 100,
        opacity: 0,
        duration: GSAP_DURATION.NORMAL,
        ease: "back.out(1.2)"
      });
    }
  }, [isVisible]);

  const acceptCookies = () => {
    if (!containerRef.current) return;
    
    // Animate out before unmounting
    gsap.to(containerRef.current, {
      y: 50,
      opacity: 0,
      duration: GSAP_DURATION.FAST,
      ease: "power2.in",
      onComplete: () => {
        localStorage.setItem("synthetic_pulse_cookie_consent", "accepted");
        setIsVisible(false);
      }
    });
  };

  const declineCookies = () => {
    if (!containerRef.current) return;
    
    gsap.to(containerRef.current, {
      y: 50,
      opacity: 0,
      duration: GSAP_DURATION.FAST,
      ease: "power2.in",
      onComplete: () => {
        setIsVisible(false);
      }
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 inset-inline-4 md:inset-inline-auto md:end-4 md:w-96 z-[60]">
      <div 
        ref={containerRef}
        className="glass-modal rounded-2xl shadow-float overflow-hidden relative group"
      >
        
        {/* Glow Element */}
        <div className="absolute top-0 inset-inline-end-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary/20 transition-colors"></div>

        <button 
          onClick={declineCookies}
          className="absolute top-3 inset-inline-start-3 text-muted-foreground w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-colors focus-ring-primary z-10"
          aria-label="إغلاق"
        >
          <FaIcon icon={faXmark} className="w-4 h-4" />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 shrink-0 bg-primary/20 text-primary rounded-full flex items-center justify-center">
              <FaIcon icon={faCookieBite} className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1">ملفات تعريف الارتباط</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا، وتحليل حركة المرور. 
                بالنقر على "موافق"، فإنك توافق على سياسة الاستخدام.
              </p>
            </div>
          </div>
          
          <div className="mt-5 flex gap-3">
            <button 
              onClick={acceptCookies}
              className="flex-1 bg-primary hover:bg-primary-hover active-press hover-glow transition-all text-black font-semibold text-sm py-2.5 rounded-xl focus-ring-primary"
            >
              موافق وأكمل
            </button>
            <button 
              onClick={declineCookies}
              className="px-6 bg-background border border-border hover:bg-surface-container active-press text-foreground text-sm py-2.5 rounded-xl transition-colors focus-ring-primary"
            >
              رفض
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
