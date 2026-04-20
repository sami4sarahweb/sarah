"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Service } from "@/types/services";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye, EyeOff, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ServicesDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchServices = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    
    if (data) setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase.from("services").update({ is_active: !currentStatus }).eq("id", id);
    fetchServices();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <header className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">الخدمات</h1>
            <p className="text-muted-foreground mt-2">إدارة خدمات التأجير والتجهيز المعروضة في الموقع.</p>
          </div>
          <Skeleton className="h-10 w-[150px] rounded-lg" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">الخدمات</h1>
          <p className="text-muted-foreground mt-2">إدارة خدمات التأجير والتجهيز المعروضة في الموقع.</p>
        </div>
        <Link href="/dashboard/services/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة خدمة
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services.map((service) => (
          <Card key={service.id} className={`glass-panel flex flex-col transition-all ${!service.is_active ? 'opacity-60 saturate-50' : ''}`}>
            {service.cover_image_url || service.main_image_url ? (
              <div className="h-32 w-full overflow-hidden rounded-t-xl bg-black/20">
                <img 
                  src={service.cover_image_url || service.main_image_url || ''} 
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-32 w-full bg-surface-container flex items-center justify-center rounded-t-xl text-muted-foreground border-b border-border/20">
                <LayoutGrid className="h-8 w-8 opacity-20" />
              </div>
            )}
            
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-base line-clamp-1 flex-1">{service.name}</CardTitle>
                <Badge variant={service.is_active ? "default" : "secondary"} className="shrink-0">
                  {service.is_active ? 'نشط' : 'مخفي'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.description || 'لا يوجد وصف قصير.'}
              </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 border-t border-border/10 flex justify-between gap-2 mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-muted-foreground hover:text-foreground flex-1"
                onClick={() => toggleActive(service.id, !!service.is_active)}
              >
                {service.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {service.is_active ? 'إخفاء' : 'إظهار'}
              </Button>
              <Link href={`/dashboard/services/${service.id}`} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full gap-2">
                  <Edit className="w-4 h-4" />
                  تعديل
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
