"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Phone, Calendar, Send } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function RequestQuotePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    phone: "",
    email: "",
    event_type: "",
    event_date: "",
    details: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("quote_requests").insert({
        full_name: formData.full_name,
        company_name: formData.company_name || null,
        phone: formData.phone,
        email: formData.email || null,
        event_type: formData.event_type || null,
        event_date: formData.event_date || null,
        details: formData.details
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إرسال طلبك. يرجى المحاولة لاحقاً أوالتواصل معنا عبر الهاتف.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-20 px-4">
        <Card className="max-w-md w-full glass-panel border-primary/30 luminous-shadow-primary text-center py-12">
          <CardContent className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">تم إرسال طلبك بنجاح</h1>
            <p className="text-muted-foreground">
              شكراً لتواصلك معنا {formData.full_name}. فريقنا سيقوم بمراجعة طلبك والتواصل معك في أقرب وقت لتقديم عرض السعر المناسب.
            </p>
            <Link href="/" className="mt-4">
              <Button variant="outline" className="gap-2">
                <ArrowRight className="w-4 h-4" />
                العودة للرئيسية
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          
          {/* Header & Info */}
          <div className="flex-1 space-y-8">
            <div>
              <Badge variant="secondary" className="mb-4">طلب عرض سعر</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neon-primary">
                دعنا نصنع لك حدثاً استثنائياً
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
                <h3 className="font-bold mb-2">تواصل مباشر</h3>
                <p className="text-sm text-muted-foreground">للحالات الطارئة، يمكنك التواصل معنا مباشرة على الهاتف.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl">
                 <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-bold mb-2">استشارة مجانية</h3>
                <p className="text-sm text-muted-foreground">نقدم لك استشارة مجانية لمساعدتك في التخطيط لفعاليتك.</p>
              </div>
            </div>
          </div>

          {/* Setup Form */}
          <div className="w-full max-w-lg shrink-0">
            <Card className="glass-panel border-t-4 border-t-primary shadow-2xl">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">تفاصيل الطلب</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-muted-foreground">الاسم الكامل <span className="text-primary">*</span></label>
                       <Input 
                         required 
                         placeholder="اسمك الكريم" 
                         value={formData.full_name}
                         onChange={e => setFormData({...formData, full_name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-muted-foreground">الشركة / الجهة</label>
                       <Input 
                         placeholder="اختياري" 
                         value={formData.company_name}
                         onChange={e => setFormData({...formData, company_name: e.target.value})}
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-muted-foreground">رقم الهاتف <span className="text-primary">*</span></label>
                       <Input 
                         required 
                         type="tel"
                         dir="ltr"
                         placeholder="05X XXX XXXX" 
                         value={formData.phone}
                         onChange={e => setFormData({...formData, phone: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-muted-foreground">البريد الإلكتروني</label>
                       <Input 
                         type="email"
                         dir="ltr"
                         placeholder="email@example.com" 
                         value={formData.email}
                         onChange={e => setFormData({...formData, email: e.target.value})}
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-muted-foreground">نوع الفعالية</label>
                       <Select value={formData.event_type} onValueChange={(v) => setFormData({...formData, event_type: v as string})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر النوع" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="زواج">زواج / عرس</SelectItem>
                            <SelectItem value="معرض">معرض تجاري</SelectItem>
                            <SelectItem value="مؤتمر">مؤتمر / ملتقى</SelectItem>
                            <SelectItem value="حفل_تخرج">حفل تخرج</SelectItem>
                            <SelectItem value="جلسة_خاصة">جلسة خارجية / خاصة</SelectItem>
                            <SelectItem value="أخرى">أخرى</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-muted-foreground">تاريخ الفعالية المستهدف</label>
                       <Input 
                         type="date"
                         value={formData.event_date}
                         onChange={e => setFormData({...formData, event_date: e.target.value})}
                       />
                    </div>
                  </div>

                  <div className="space-y-2 mt-2">
                     <label className="text-sm font-semibold text-muted-foreground">ما الذي تحتاجه بالضبط؟ <span className="text-primary">*</span></label>
                     <Textarea 
                       required 
                       rows={5}
                       placeholder="صِف لنا المنتجات التي ترغب باستئجارها، الكميات التقريبية، وموقع الفعالية..."
                       value={formData.details}
                       onChange={e => setFormData({...formData, details: e.target.value})}
                     />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full mt-4 h-12 text-black font-bold text-lg gap-2"
                    disabled={loading}
                  >
                    <Send className="w-5 h-5" />
                    {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                  </Button>

                </form>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}
