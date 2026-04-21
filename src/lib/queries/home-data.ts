import { createClient } from "@/lib/supabase/server";

export interface HomeService {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  main_image_url: string | null;
  icon_name: string | null;
}

export interface HomeProject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  client_name: string | null;
  main_image_url: string | null;
  testimonial_text: string | null;
  testimonial_rating: number | null;
  event_date: string | null;
}

export interface HomeGalleryItem {
  id: string;
  type: "image" | "youtube_wide" | "youtube_short";
  url: string;
  thumbnail_url: string | null;
  title: string;
  category_name: string | null;
}

export interface HomePageData {
  services: HomeService[];
  projects: HomeProject[];
  testimonials: HomeProject[];
  gallery: HomeGalleryItem[];
}

export async function getHomePageData(): Promise<HomePageData> {
  const supabase = await createClient();

  const [servicesRes, projectsRes, galleryRes] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, slug, description, main_image_url, icon_name")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(8),

    supabase
      .from("projects")
      .select("id, title, slug, description, client_name, main_image_url, testimonial_text, testimonial_rating, event_date")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(6),

    supabase
      .from("gallery_media")
      .select("id, type, url, thumbnail_url, title, category_id, gallery_categories(name)")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const services = (servicesRes.data ?? []) as HomeService[];
  const projects = (projectsRes.data ?? []) as HomeProject[];
  const testimonials = projects.filter((p) => p.testimonial_text && p.testimonial_rating);

  const gallery: HomeGalleryItem[] = (galleryRes.data ?? []).map((item: Record<string, unknown>) => ({
    id: item.id as string,
    type: item.type as HomeGalleryItem["type"],
    url: item.url as string,
    thumbnail_url: item.thumbnail_url as string | null,
    title: item.title as string,
    category_name: (item.gallery_categories as Record<string, string> | null)?.name ?? null,
  }));

  return { services, projects, testimonials, gallery };
}
