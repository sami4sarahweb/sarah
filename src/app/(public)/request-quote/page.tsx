"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, CheckCircle2, Phone, Calendar, Send, Sparkles } from "lucide-react";
import Link from "next/link";

interface ServiceOption {
  id: string;
  name: string;
  slug: string;
}

export default function RequestQuotePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    phone: "",
    email: "",
    event_type: "",
    event_date: "",
    details: ""
  });

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from("services")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (data) setServices(data);
    };
    fetchServices();
  }, []);

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Insert quote request
      const { data: quote, error } = await supabase
        .from("quote_requests")
        .insert({
          full_name: formData.full_name,
          company_name: formData.company_name || null,
          phone: formData.phone,
          email: formData.email || null,
          event_type: formData.event_type || null,
          event_date: formData.event_date || null,
          details: formData.details,
        })
        .select("id")
        .single();

      if (error) throw error;

      // 2. Insert selected services
      if (quote && selectedServiceIds.length > 0) {
        const rows = selectedServiceIds.map((sid) => ({
          quote_request_id: quote.id,
          service_id: sid,
        }));
        await supabase.from("quote_request_services").insert(rows);
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إرسال طلبك. يرجى المحاولة لاحقاً أو التواصل معنا عبر الهاتف.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full glass-panel border-primary/30 rounded-3xl text-center py-12 px-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">تم إرسال طلبك بنجاح</h1>
          <p className="text-muted-foreground leading-relaxed">
            شكراً لتواصلك معنا {formData.full_name}. فريقنا سيقوم بمراجعة طلبك والتواصل معك في أقرب وقت لتقديم عرض السعر المناسب.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl border border-border hover:border-primary/50 text-foreground hover:text-primary font-semibold transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Left: Info */}
          <div className="flex-1 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                طلب عرض سعر
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                دعنا نصنع لك حدثاً <span className="text-primary">استثنائياً</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                سواء كنت تخطط لحفل زفاف، مؤتمر شركة، أو معرض تجاري، فإن فريقنا المتخصص جاهز لتزويدك بأفضل القطع وأرقى التجهيزات التي تليق بك.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-border/50">
              <div className="glass-panel p-6 rounded-2xl">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">تواصل مباشر</h3>
                <p className="text-sm text-muted-foreground">للحالات الطارئة، يمكنك التواصل معنا مباشرة على الهاتف.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">استشارة مجانية</h3>
                <p className="text-sm text-muted-foreground">نقدم لك استشارة مجانية لمساعدتك في التخطيط لفعاليتك.</p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full max-w-lg shrink-0">
            <div className="glass-panel rounded-3xl border-t-4 border-t-primary shadow-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">تفاصيل الطلب</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">الاسم الكامل <span className="text-primary">*</span></label>
                    <input
                      required
                      placeholder="اسمك الكريم"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">الشركة / الجهة</label>
                    <input
                      placeholder="اختياري"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">رقم الهاتف <span className="text-primary">*</span></label>
                    <input
                      required
                      type="tel"
                      dir="ltr"
                      placeholder="05X XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-left"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">البريد الإلكتروني</label>
                    <input
                      type="email"
                      dir="ltr"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-left"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">نوع الفعالية</label>
                    <select
                      value={formData.event_type}
                      onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-border/50 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all appearance-none"
                    >
                      <option value="">اختر النوع</option>
                      <option value="زواج">زواج / عرس</option>
                      <option value="معرض">معرض تجاري</option>
                      <option value="مؤتمر">مؤتمر / ملتقى</option>
                      <option value="حفل_تخرج">حفل تخرج</option>
                      <option value="جلسة_خاصة">جلسة خارجية / خاصة</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">تاريخ الفعالية</label>
                    <input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-border/50 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                </div>

                {/* Service Multi-Select */}
                {services.length > 0 && (
                  <div className="space-y-3 mt-2">
                    <label className="text-sm font-semibold text-muted-foreground">
                      الخدمات المطلوبة <span className="text-xs text-muted-foreground/60">(اختياري — اختر ما يناسبك)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                      {services.map((s) => {
                        const isSelected = selectedServiceIds.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => toggleService(s.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-right transition-all duration-200 border ${
                              isSelected
                                ? "bg-primary/10 border-primary/50 text-primary"
                                : "bg-surface-container border-border/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${
                              isSelected ? "bg-primary border-primary" : "border-border"
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="line-clamp-1">{s.name}</span>
                          </button>
                        );
                      })}
                    </div>
                    {selectedServiceIds.length > 0 && (
                      <p className="text-xs text-primary">تم اختيار {selectedServiceIds.length} خدمة</p>
                    )}
                  </div>
                )}

                <div className="space-y-2 mt-2">
                  <label className="text-sm font-semibold text-muted-foreground">ما الذي تحتاجه بالضبط؟ <span className="text-primary">*</span></label>
                  <textarea
                    required
                    rows={5}
                    placeholder="صِف لنا المنتجات التي ترغب باستئجارها، الكميات التقريبية، وموقع الفعالية..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 h-12 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                >
                  <Send className="w-5 h-5" />
                  {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
