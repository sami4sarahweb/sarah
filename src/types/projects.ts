import { Database } from './database.types';
import { Service } from './services';
import { GalleryMedia } from '@/components/gallery/media-grid';

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type ProjectService = Database['public']['Tables']['project_services']['Row'];
export type ProjectMedia = Database['public']['Tables']['project_media']['Row'];

export type ProjectWithRelations = Project & {
  project_services: (ProjectService & { services: Service })[];
  project_media: (ProjectMedia & { gallery_media: GalleryMedia })[];
};
