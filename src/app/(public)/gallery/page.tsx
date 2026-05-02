import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";
import type { Metadata } from "next";
import { GalleryPageWrapper } from "./gallery-page-wrapper";
import { AnimatedText } from "@/components/animations/animated-text";
import { AnimatedSection } from "@/components/animations/animated-section";
import { Badge } from "@/components/ui/badge";
import { FaIcon } from "@/components/ui/fa-icon";
import { faImage } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "معرض الأعمال | Synthetic Pulse",
  description: "تصفح مكتبة الصور والفيديوهات لأحدث مشاريعنا وفعالياتنا وتجهيزاتنا في جميع أنحاء المملكة.",
};

export default async function GalleryPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { data: categories } = await supabase
    .from("gallery_categories")
    .select("id, name, slug")
    .order("sort_order", { ascending: true });

  const { data: media } = await supabase
    .from("gallery_media")
    .select("*, gallery_categories(name)")
    .order("created_at", { ascending: false });

  const formattedMedia = (media || []).map(m => ({
    id: m.id,
    type: m.type as "image" | "youtube_wide" | "youtube_short",
    url: m.url,
    thumbnail_url: m.thumbnail_url,
    title: m.title,
    category_name: Array.isArray(m.gallery_categories) 
      ? m.gallery_categories[0]?.name 
      : (m.gallery_categories as any)?.name || null,
    category_id: m.category_id
  }));

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 md:pt-36 flex flex-col items-center">
      
      {/* Background Decor */}
      <div className="absolute top-0 start-0 w-full h-[500px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-100px] start-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container-wide px-6 relative z-10 w-full">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Badge variant="secondary" className="mb-4 text-secondary border-secondary/20 bg-secondary/10 gap-2 px-4 py-1.5 hover-glow border">
              <FaIcon icon={faImage} className="w-3.5 h-3.5 text-secondary" />
              اللقطات المرئية
            </Badge>
          </AnimatedSection>
          
          <AnimatedText
            text="معرض أعمالنا المنجزة"
            type="words"
            tag="h1"
            stagger={0.1}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground drop-shadow-lg"
          />
          
          <AnimatedSection animation="fade-up" delay={0.3}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              تصفح مكتبتنا الشاملة للصور ومقاطع الفيديو من أحدث تجهيزاتنا في المعارض والمناسبات الكبرى، واستلهم أفكاراً مميزة لفعاليتك القادمة.
            </p>
          </AnimatedSection>
        </div>

        <GalleryPageWrapper media={formattedMedia} categories={(categories as any) || []} />
      </div>

    </div>
  );
}
