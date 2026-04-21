import { createClient } from "@/lib/supabase/server";

export interface ContactMethod {
  id: string;
  type: "whatsapp" | "call" | "mail" | "social" | "pdf";
  platform: string | null;
  value: string;
  follower_count: number | null;
}

export interface ServiceLink {
  name: string;
  slug: string;
}

export interface PublicSiteData {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  socials: ContactMethod[];
  services: ServiceLink[];
}

export async function getPublicSiteData(): Promise<PublicSiteData> {
  const supabase = await createClient();

  const [contactRes, servicesRes] = await Promise.all([
    supabase
      .from("contact_methods")
      .select("id, type, platform, value, follower_count")
      .order("created_at", { ascending: true }),
    supabase
      .from("services")
      .select("name, slug")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const contacts = (contactRes.data ?? []) as ContactMethod[];
  const services = (servicesRes.data ?? []) as ServiceLink[];

  const phoneRecord = contacts.find((c) => c.type === "call");
  const whatsappRecord = contacts.find((c) => c.type === "whatsapp");
  const emailRecord = contacts.find((c) => c.type === "mail");
  const socials = contacts.filter((c) => c.type === "social");

  return {
    phone: phoneRecord?.value ?? null,
    whatsapp: whatsappRecord?.value ?? null,
    email: emailRecord?.value ?? null,
    socials,
    services,
  };
}
