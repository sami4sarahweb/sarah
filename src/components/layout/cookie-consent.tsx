"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

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

  const acceptCookies = () => {
    localStorage.setItem("synthetic_pulse_cookie_consent", "accepted");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[60] animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="bg-surface-container-high/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden relative group">
        
        {/* Glow Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary/20 transition-colors"></div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 left-3 text-muted-foreground w-6 h-6 flex items-center justify-center rounded-full hover:bg-background transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 shrink-0 bg-primary/20 text-primary rounded-full flex items-center justify-center">
              <Cookie className="w-5 h-5" />
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
              className="flex-1 bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all text-black font-semibold text-sm py-2 rounded-xl"
            >
              موافق وأكمل
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="px-4 bg-background border border-border hover:bg-surface-container text-foreground text-sm py-2 rounded-xl transition-colors"
            >
              رفض
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
