export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      paginas_estaticas: {
        Row: {
          content: string | null;
          created_at: string;
          featured_image_url: string | null;
          id: string;
          meta_description: string | null;
          meta_title: string | null;
          slug: string;
          title: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          featured_image_url?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          slug: string;
          title: string;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          featured_image_url?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          slug?: string;
          title?: string;
        };
        Relationships: [];
      };
      productos: {
        Row: {
          content: string | null;
          created_at: string;
          especificaciones: string | null;
          excerpt: string | null;
          featured_image_url: string | null;
          galeria_urls: Json | null;
          id: string;
          is_published: boolean;
          meta_description: string | null;
          meta_title: string | null;
          precio: number | null;
          sku: string | null;
          slug: string;
          title: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          especificaciones?: string | null;
          excerpt?: string | null;
          featured_image_url?: string | null;
          galeria_urls?: Json | null;
          id?: string;
          is_published?: boolean;
          meta_description?: string | null;
          meta_title?: string | null;
          precio?: number | null;
          sku?: string | null;
          slug: string;
          title: string;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          especificaciones?: string | null;
          excerpt?: string | null;
          featured_image_url?: string | null;
          galeria_urls?: Json | null;
          id?: string;
          is_published?: boolean;
          meta_description?: string | null;
          meta_title?: string | null;
          precio?: number | null;
          sku?: string | null;
          slug?: string;
          title?: string;
        };
        Relationships: [];
      };
      proyectos: {
        Row: {
          cliente: string | null;
          content: string | null;
          created_at: string;
          detalles_alcance: string | null;
          excerpt: string | null;
          featured_image_url: string | null;
          fecha_de_realizacion: string | null;
          id: string;
          imagen_adicional_url: string | null;
          is_published: boolean;
          meta_description: string | null;
          meta_title: string | null;
          slug: string;
          title: string;
        };
        Insert: {
          cliente?: string | null;
          content?: string | null;
          created_at?: string;
          detalles_alcance?: string | null;
          excerpt?: string | null;
          featured_image_url?: string | null;
          fecha_de_realizacion?: string | null;
          id?: string;
          imagen_adicional_url?: string | null;
          is_published?: boolean;
          meta_description?: string | null;
          meta_title?: string | null;
          slug: string;
          title: string;
        };
        Update: {
          cliente?: string | null;
          content?: string | null;
          created_at?: string;
          detalles_alcance?: string | null;
          excerpt?: string | null;
          featured_image_url?: string | null;
          fecha_de_realizacion?: string | null;
          id?: string;
          imagen_adicional_url?: string | null;
          is_published?: boolean;
          meta_description?: string | null;
          meta_title?: string | null;
          slug?: string;
          title?: string;
        };
        Relationships: [];
      };
      servicios: {
        Row: {
          alcance_del_servicio: string | null;
          content: string | null;
          created_at: string;
          excerpt: string | null;
          featured_image_url: string | null;
          icono_url: string | null;
          id: string;
          is_published: boolean;
          meta_description: string | null;
          meta_title: string | null;
          precio: number | null;
          slug: string;
          title: string;
        };
        Insert: {
          alcance_del_servicio?: string | null;
          content?: string | null;
          created_at?: string;
          excerpt?: string | null;
          featured_image_url?: string | null;
          icono_url?: string | null;
          id?: string;
          is_published?: boolean;
          meta_description?: string | null;
          meta_title?: string | null;
          precio?: number | null;
          slug: string;
          title: string;
        };
        Update: {
          alcance_del_servicio?: string | null;
          content?: string | null;
          created_at?: string;
          excerpt?: string | null;
          featured_image_url?: string | null;
          icono_url?: string | null;
          id?: string;
          is_published?: boolean;
          meta_description?: string | null;
          meta_title?: string | null;
          precio?: number | null;
          slug?: string;
          title?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
