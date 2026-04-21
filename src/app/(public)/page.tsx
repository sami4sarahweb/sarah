import Link from "next/link";
import { ArrowLeft, Diamond, Sparkles, MoveLeft } from "lucide-react";

export default function PublicHomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden pt-20">
        {/* Abstract Background Engine */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-primary/20 rounded-[100%] blur-[120px] mix-blend-screen opacity-60 animate-pulse"></div>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent z-10"></div>
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        </div>

        <div className="container relative z-20 mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary tracking-wide">تصميم بلا حدود لفعالياتك القادمة</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground max-w-5xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            تجهيزات فاخرة تصنع <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]">اللحظة</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            الوجهة الأولى لتأجير أحدث التجهيزات والمنظومات الحدثية. من المعارض الكبرى إلى المناسبات الخاصة، نحن نبني لك مسرح أحلامك بأرقى المواصفات.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
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

      {/* Trust Metrics Section */}
      <section className="relative py-20 border-t border-border/30 bg-surface-container/30">
        <div className="container mx-auto px-4 z-10 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center justify-center text-center space-y-2 p-6 glass-panel rounded-2xl hover:border-primary/50 transition-colors duration-500">
              <span className="text-4xl md:text-5xl font-bold text-foreground">500+</span>
              <span className="text-sm font-medium text-muted-foreground">فعالية منجزة</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-2 p-6 glass-panel rounded-2xl hover:border-primary/50 transition-colors duration-500 delay-100">
              <span className="text-4xl md:text-5xl font-bold text-foreground">50+</span>
              <span className="text-sm font-medium text-muted-foreground">شريك نجاح</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-2 p-6 glass-panel rounded-2xl hover:border-primary/50 transition-colors duration-500 delay-200">
              <span className="text-4xl md:text-5xl font-bold text-foreground">10K</span>
              <span className="text-sm font-medium text-muted-foreground">قطعة تأجير</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-2 p-6 glass-panel rounded-2xl hover:border-primary/50 transition-colors duration-500 delay-300">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <Diamond className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary tracking-wide">جودة ملكية مضمونة</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
