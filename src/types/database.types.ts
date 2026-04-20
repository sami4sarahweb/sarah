export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_methods: {
        Row: {
          created_at: string
          follower_count: number | null
          id: string
          platform: string | null
          type: string
          value: string
        }
        Insert: {
          created_at?: string
          follower_count?: number | null
          id?: string
          platform?: string | null
          type: string
          value: string
        }
        Update: {
          created_at?: string
          follower_count?: number | null
          id?: string
          platform?: string | null
          type?: string
          value?: string
        }
        Relationships: []
      }
      gallery_categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      gallery_media: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          thumbnail_url: string | null
          title: string
          type: string
          url: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          type: string
          url: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_media_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "gallery_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      project_media: {
        Row: {
          created_at: string
          id: string
          media_id: string
          project_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          media_id: string
          project_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          media_id?: string
          project_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "gallery_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_services: {
        Row: {
          created_at: string
          project_id: string
          service_id: string
        }
        Insert: {
          created_at?: string
          project_id: string
          service_id: string
        }
        Update: {
          created_at?: string
          project_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_name: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          is_active: boolean | null
          main_image_url: string | null
          slug: string
          sort_order: number | null
          testimonial_rating: number | null
          testimonial_text: string | null
          title: string
        }
        Insert: {
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          is_active?: boolean | null
          main_image_url?: string | null
          slug: string
          sort_order?: number | null
          testimonial_rating?: number | null
          testimonial_text?: string | null
          title: string
        }
        Update: {
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          is_active?: boolean | null
          main_image_url?: string | null
          slug?: string
          sort_order?: number | null
          testimonial_rating?: number | null
          testimonial_text?: string | null
          title?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          company_name: string | null
          created_at: string
          details: string
          email: string | null
          event_date: string | null
          event_type: string | null
          full_name: string
          id: string
          phone: string
          status: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          details: string
          email?: string | null
          event_date?: string | null
          event_type?: string | null
          full_name: string
          id?: string
          phone: string
          status?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          details?: string
          email?: string | null
          event_date?: string | null
          event_type?: string | null
          full_name?: string
          id?: string
          phone?: string
          status?: string | null
        }
        Relationships: []
      }
      service_media: {
        Row: {
          created_at: string
          id: string
          media_id: string
          property_id: string | null
          role: string | null
          service_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          media_id: string
          property_id?: string | null
          role?: string | null
          service_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          media_id?: string
          property_id?: string | null
          role?: string | null
          service_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "gallery_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_media_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "service_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_media_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_properties: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          service_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          service_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          service_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_properties_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          details: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          main_image_url: string | null
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          details?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          main_image_url?: string | null
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          details?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          main_image_url?: string | null
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
