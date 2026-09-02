"use client";

import { useState } from "react";
import { FaIcon } from "@/components/ui/fa-icon";
import { faLocationDot, faPhone, faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { AnimatedText } from "@/components/animations/animated-text";
import { AnimatedSection } from "@/components/animations/animated-section";
import { ParallaxLayer } from "@/components/animations/parallax-layer";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { trackLeadConversion } from "@/lib/gtag";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      trackLeadConversion(1.0, "SAR");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Auto dismiss success MSG
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-28 pb-20 md:pt-36">
      
      <div className="container-wide px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <AnimatedText 
            text="تواصل معنا"
            tag="h1"
            type="words"
            className="text-4xl md:text-5xl font-bold mb-6 text-foreground drop-shadow-lg"
          />
          <AnimatedSection animation="fade-up" delay={0.2}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              نحن دائماً بالقرب منك. لا تتردد في متواصلة فريق Synthetic Pulse لأي استفسار أو لترتيب اجتماع خاص بفعاليتك.
            </p>
          </AnimatedSection>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Left: Contact Info & Map */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            
            <AnimatedSection animation="stagger-children" delay={0.3} className="grid sm:grid-cols-2 gap-6">
              
              <div className="glass-panel p-6 rounded-2xl border border-border/30 hover-border-glow transition-all group">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6 shadow-glow-sm group-hover:scale-110 transition-transform">
                  <FaIcon icon={faLocationDot} className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">المركز الرئيسي</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  المملكة العربية السعودية<br />
                  الرياض، العليا<br />
                  شارع التحلية
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-border/30 hover-border-glow transition-all group shrink-0">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6 shadow-glow-sm group-hover:scale-110 transition-transform">
                    <FaIcon icon={faPhone} className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">اتصل بنا</h3>
                  <p className="text-sm font-semibold text-muted-foreground" dir="ltr">
                    +966 50 123 4567
                  </p>
                </div>
                
                <div className="glass-panel p-6 rounded-2xl border border-border/30 hover-border-glow transition-all group shrink-0">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6 shadow-glow-sm group-hover:scale-110 transition-transform">
                    <FaIcon icon={faEnvelope} className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">البريد الإلكتروني</h3>
                  <p className="text-sm font-semibold text-muted-foreground" dir="ltr">
                    hello@syntheticpulse.com
                  </p>
                </div>
              </div>

            </AnimatedSection>

            {/* Map Area */}
            <AnimatedSection animation="fade-up" delay={0.5} className="mt-4">
              <div className="relative w-full h-80 rounded-3xl overflow-hidden glass-panel border border-border/30 group">
                <ParallaxLayer speed={-0.2} className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1588691518342-d3527712e09b?q=80&w=1200&auto=format&fit=crop" 
                    alt="موقع المكتب"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000 grayscale origin-center"
                  />
                </ParallaxLayer>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex items-center justify-center pointer-events-none">
                  <div className="p-4 bg-background/80 backdrop-blur-md rounded-2xl border border-primary/30 shadow-glow-sm flex flex-col items-center">
                    <FaIcon icon={faLocationDot} className="w-8 h-8 text-primary mb-2 animate-bounce" />
                    <span className="font-bold text-sm">مقرنا في الرياض</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right: Contact Form */}
          <div className="w-full lg:w-1/2">
            <AnimatedSection animation="fade-inline" delay={0.4}>
              <div className="glass-panel p-8 md:p-10 rounded-3xl border-t-4 border-t-primary shadow-glow-lg relative overflow-hidden">
                <div className="absolute top-0 end-0 w-40 h-40 bg-primary/10 rounded-full blur-[60px] -me-10 -mt-10 pointer-events-none" />
                
                <h2 className="text-2xl font-bold mb-8 text-foreground">أرسل لنا رسالة</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">الاسم <span className="text-primary">*</span></label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="اسمك الكريم"
                        className="w-full px-4 py-3 rounded-xl bg-surface-container/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-shadow"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">البريد الإلكتروني <span className="text-primary">*</span></label>
                      <input
                        required
                        type="email"
                        dir="ltr"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-surface-container/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-shadow text-left"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">الموضوع</label>
                    <input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="عنوان الرسالة"
                      className="w-full px-4 py-3 rounded-xl bg-surface-container/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-shadow"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">الرسالة <span className="text-primary">*</span></label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="كيف يمكننا مساعدتك؟"
                      className="w-full px-4 py-3 rounded-xl bg-surface-container/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-shadow resize-none custom-scrollbar"
                    />
                  </div>

                  <MagneticButton strength={0.1}>
                    <button
                      type="submit"
                      disabled={loading || success}
                      className={`btn-cta w-full h-14 mt-4 font-bold text-lg flex items-center justify-center shadow-glow-sm overflow-hidden relative transition-all ${
                        success ? 'bg-green-500 hover:bg-green-600 text-white' : ''
                      }`}
                    >
                      {loading ? (
                        <span>جاري الإرسال...</span>
                      ) : success ? (
                        <span>تم الإرسال بنجاح!</span>
                      ) : (
                        <>
                          <FaIcon icon={faPaperPlane} className="w-5 h-5 ms-1" />
                          إرسال الرسالة
                        </>
                      )}
                    </button>
                  </MagneticButton>
                </form>

              </div>
            </AnimatedSection>
          </div>

        </div>
      </div>
    </div>
  );
}
