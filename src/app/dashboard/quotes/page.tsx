"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { arSA } from "date-fns/locale";
import { Phone, Mail, Building2, Calendar, MessageSquare, Clock, Briefcase } from "lucide-react";

type QuoteRequest = Database['public']['Tables']['quote_requests']['Row'] & {
  quote_request_services?: { service_id: string; services: { name: string } | null }[];
};

const STATUS_MAP = {
  'new': { label: 'جديد', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  'contacted': { label: 'تم التواصل', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  'completed': { label: 'مكتمل', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  'canceled': { label: 'ملغي', color: 'bg-red-500/10 text-red-500 border-red-500/20' }
};

export default function QuotesDashboard() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const supabase = createClient();

  const fetchQuotes = async () => {
    setLoading(true);
    let query = supabase.from("quote_requests").select("*, quote_request_services(service_id, services(name))").order("created_at", { ascending: false });
    
    if (filter !== 'all') {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    if (data) setQuotes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, [filter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("quote_requests").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">طلبات العروض (Leads)</h1>
          <p className="text-muted-foreground mt-2">إدارة طلبات الاستعارة والتجهيز الواردة من العملاء عبر الموقع.</p>
        </div>
        
        <Select value={filter} onValueChange={(val) => setFilter(val as string)}>
          <SelectTrigger className="w-[180px] glass-panel">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الطلبات</SelectItem>
            <SelectItem value="new">طلبات جديدة</SelectItem>
            <SelectItem value="contacted">تم التواصل</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="canceled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : quotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-container/30 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground">لا توجد طلبات متطابقة مع هذا الفلتر.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((quote) => {
            const statusMeta = STATUS_MAP[quote.status as keyof typeof STATUS_MAP] || STATUS_MAP['new'];
            
            return (
              <Card key={quote.id} className="glass-panel border-border/50 hover:border-primary/30 transition-colors flex flex-col">
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{quote.full_name}</CardTitle>
                    {quote.company_name ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Building2 className="w-3 h-3" />
                        <span>{quote.company_name}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground mt-1">فرد</div>
                    )}
                  </div>
                  <Select value={quote.status || 'new'} onValueChange={(val) => handleStatusChange(quote.id, val as string)}>
                    <SelectTrigger className={`w-[120px] h-8 text-xs font-semibold ${statusMeta.color}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">جديد</SelectItem>
                      <SelectItem value="contacted">تم التواصل</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="canceled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col gap-4 text-sm">
                  {/* Contact Info */}
                  <div className="bg-surface-container/50 p-3 rounded-lg flex flex-col gap-2">
                    <a href={`tel:${quote.phone}`} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="font-mono text-left" dir="ltr">{quote.phone}</span>
                    </a>
                    {quote.email && (
                      <a href={`mailto:${quote.email}`} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>{quote.email}</span>
                      </a>
                    )}
                  </div>

                  {/* Event Info */}
                  <div className="flex flex-col gap-2">
                    {quote.event_type && (
                     <div className="flex items-center gap-2 text-muted-foreground bg-surface-container-high px-2 py-1 rounded w-max">
                        <span className="text-xs font-bold text-primary">نوع الحدث:</span>
                        <span className="text-xs">{quote.event_type}</span>
                     </div>
                    )}
                    {quote.event_date && (
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">الموعد المستهدف: {new Date(quote.event_date).toLocaleDateString('ar-SA')}</span>
                      </div>
                    )}
                  </div>

                  {/* Selected Services */}
                  {quote.quote_request_services && quote.quote_request_services.length > 0 && (
                    <div className="mt-1">
                      <div className="flex items-center gap-1 mb-2 text-foreground/80">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-xs font-bold">الخدمات المطلوبة:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {quote.quote_request_services.map((qs) => (
                          <Badge key={qs.service_id} variant="secondary" className="text-[10px] border-primary/20">
                            {qs.services?.name || "—"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1 mb-1 text-foreground/80">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-xs font-bold">تفاصيل الطلب:</span>
                    </div>
                    <p className="pl-4 border-r-2 border-border/50 text-xs leading-relaxed line-clamp-4">
                      {quote.details}
                    </p>
                  </div>

                </CardContent>

                <CardFooter className="pt-4 border-t border-border/20 text-xs text-muted-foreground flex items-center justify-between">
                  <div className="flex items-center gap-1">
                     <Clock className="w-3 h-3" />
                     <span>{formatDistanceToNow(new Date(quote.created_at), { addSuffix: true, locale: arSA })}</span>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
