import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";
import Link from "next/link";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "خدمات التأجير المتنوعة | Synthetic Pulse",
  description: "اكتشف تشكيلتنا الواسعة من خدمات التأجير بما في ذلك الكنب، الخيام، والجلسات الخارجية بتصاميم حديثة وكلاسيكية.",
};

export default async function ServicesListing() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { data: services } = await supabase
    .from("services")
    .select("*, service_properties(*)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (!services || services.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">الخدمات</h1>
        <p className="text-muted-foreground">لا توجد خدمات متاحة حالياً.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neon-primary">
            خدمات التأجير وتجهيز الفعاليات
          </h1>
          <p className="text-lg text-muted-foreground">
            نوفر لكم مجموعة متكاملة من أرقى خدمات التأجير والتجهيز لتلبية كافة احتياجات مناسباتكم ومعارضكم بلمسات فنية متقنة.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`} className="group block h-full">
              <div className="relative glass-panel rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:luminous-shadow-primary hover:border-primary/50">
                
                {/* Hero / Cover Image */}
                <div className="h-48 w-full overflow-hidden bg-surface-container relative">
                  {service.cover_image_url || service.main_image_url ? (
                    <img 
                      src={service.cover_image_url || service.main_image_url || ''} 
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <LayoutGrid className="h-12 w-12" />
                    </div>
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col -mt-10 relative z-10 transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="bg-surface-container-high border border-border/50 shadow-lg rounded-xl p-4 flex-1 flex flex-col backdrop-blur-md">
                    <h3 className="text-xl font-bold mb-3">{service.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                      {service.description || 'لا يوجد وصف.'}
                    </p>
                    
                    <div className="flex items-center text-primary text-sm font-semibold justify-between mt-auto">
                      <span>عرض التفاصيل</span>
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
