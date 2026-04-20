import { Database } from './database.types';

export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

export type ServiceProperty = Database['public']['Tables']['service_properties']['Row'];
export type ServicePropertyInsert = Database['public']['Tables']['service_properties']['Insert'];

export type ServiceMedia = Database['public']['Tables']['service_media']['Row'];
export type ServiceMediaInsert = Database['public']['Tables']['service_media']['Insert'];
