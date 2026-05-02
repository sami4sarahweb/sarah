import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sarah.riyadheventplanner.com';

  // Create supabase client
  const supabase = await createClient();

  // Fetch all active projects
  const { data: projects } = await supabase
    .from('projects')
    .select('slug, created_at')
    .eq('is_active', true);

  // Fetch all active services
  const { data: services } = await supabase
    .from('services')
    .select('slug, created_at')
    .eq('is_active', true);

  const projectUrls: MetadataRoute.Sitemap = (projects || []).map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const serviceUrls: MetadataRoute.Sitemap = (services || []).map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(service.created_at),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/request-quote`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  return [...staticUrls, ...serviceUrls, ...projectUrls];
}
