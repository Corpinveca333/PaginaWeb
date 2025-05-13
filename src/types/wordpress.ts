// Interfaz para posts obtenidos vía API REST de WordPress
export interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

// Interfaz para posts obtenidos vía GraphQL
export interface WPGraphQLPost {
  id: number;
  date: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
      altText: string;
    }
  };
}

// Interfaz unificada para componentes que pueden recibir datos de ambas fuentes
export interface UnifiedPost {
  id: string | number;
  slug: string;
  date: string;
  title: string | { rendered: string };
  excerpt: string | { rendered: string };
  content?: string | { rendered: string };
  featuredImage?: {
    sourceUrl?: string;
    altText?: string;
  } | {
    node?: {
      sourceUrl: string;
      altText: string;
    }
  } | null;
  // Soporte para formato de la API REST con _embedded
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text?: string;
    }>;
  };
  // Nuevos campos agregados
  category?: string;
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  author?: WordPressAuthor;
}

export interface WPPage extends WPPost {
  parent: number;
  menu_order: number;
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WordPressAuthor {
  name: string;
  avatar?: string;
}

interface WordPressImage {
  sourceUrl: string;
  altText?: string;
}

interface WordPressImageNode {
  node: {
    sourceUrl: string;
    altText?: string;
  };
}

export interface WordPressApiResponse {
  posts: UnifiedPost[];
  totalPages?: number;
} 