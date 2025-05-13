import { UnifiedPost, WordPressApiResponse } from "@/types/wordpress";

/**
 * Clase para gestionar todas las peticiones a la API de WordPress
 */
class APIService {
  private baseUrl: string;
  private graphqlEndpoint: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://api.example.com/wp-json/wp/v2';
    this.graphqlEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT || 'https://api.example.com/graphql';
  }

  /**
   * Realiza una petición a la API REST de WordPress
   */
  async fetchFromREST<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    // Convertir parámetros a cadena de consulta
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });

    const url = `${this.baseUrl}/${endpoint}${params ? `?${queryParams.toString()}` : ''}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Revalidar cada hora
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching from REST API:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición a la API GraphQL de WordPress
   */
  async fetchFromGraphQL<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
    try {
      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
        next: { revalidate: 3600 }, // Revalidar cada hora
      });

      if (!response.ok) {
        throw new Error(`Error en la petición GraphQL: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(`Error en la respuesta GraphQL: ${result.errors[0].message}`);
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching from GraphQL API:', error);
      throw error;
    }
  }

  /**
   * Obtiene un listado de posts
   */
  async getPosts(page: number = 1, perPage: number = 10): Promise<WordPressApiResponse> {
    try {
      // Primero intentamos con GraphQL
      const postData = await this.fetchPostsGraphQL(page, perPage);
      return postData;
    } catch (error) {
      console.warn('Error fetching posts from GraphQL, falling back to REST API:', error);
      // Fallback a la API REST
      return this.fetchPostsREST(page, perPage);
    }
  }

  /**
   * Obtiene un post por su slug
   */
  async getPostBySlug(slug: string): Promise<UnifiedPost | null> {
    try {
      // Primero intentamos con GraphQL
      const post = await this.fetchPostBySlugGraphQL(slug);
      return post;
    } catch (error) {
      console.warn('Error fetching post from GraphQL, falling back to REST API:', error);
      // Fallback a la API REST
      return this.fetchPostBySlugREST(slug);
    }
  }

  /**
   * Implementación específica para obtener posts de GraphQL
   */
  private async fetchPostsGraphQL(page: number, perPage: number): Promise<WordPressApiResponse> {
    const query = `
      query GetPosts($first: Int!, $after: String) {
        posts(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            date
            slug
            title
            excerpt
            content
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            categories {
              nodes {
                id
                name
                slug
              }
            }
            author {
              node {
                name
                avatar {
                  url
                }
              }
            }
          }
        }
      }
    `;

    // Calcular el cursor para la paginación
    const after = page > 1 ? btoa(`arrayconnection:${(page - 1) * perPage - 1}`) : null;
    
    const data = await this.fetchFromGraphQL<any>(query, {
      first: perPage,
      after,
    });

    // Transformar a un formato uniforme
    const posts = data.posts.nodes.map((post: any): UnifiedPost => ({
      id: post.id,
      date: post.date,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      categories: post.categories?.nodes,
      category: post.categories?.nodes?.[0]?.name || '',
      author: {
        name: post.author?.node?.name || '',
        avatar: post.author?.node?.avatar?.url || '',
      },
    }));

    return {
      posts,
      totalPages: -1, // GraphQL no proporciona el total de páginas directamente
    };
  }

  /**
   * Implementación específica para obtener posts de REST API
   */
  private async fetchPostsREST(page: number, perPage: number): Promise<WordPressApiResponse> {
    const posts = await this.fetchFromREST<any[]>('posts', {
      page,
      per_page: perPage,
      _embed: 'wp:featuredmedia,author',
    });

    // Total de páginas desde los headers
    const totalPages = 10; // Placeholder, normalmente se extrae de los headers de la respuesta

    // Transformar a un formato uniforme
    const unifiedPosts = posts.map((post: any): UnifiedPost => ({
      id: post.id,
      date: post.date,
      slug: post.slug,
      title: {
        rendered: post.title.rendered,
      },
      excerpt: {
        rendered: post.excerpt.rendered,
      },
      content: {
        rendered: post.content.rendered,
      },
      _embedded: post._embedded,
      author: {
        name: post._embedded?.author?.[0]?.name || '',
        avatar: post._embedded?.author?.[0]?.avatar_urls?.['96'] || '',
      }
    }));

    return {
      posts: unifiedPosts,
      totalPages,
    };
  }

  /**
   * Implementación específica para obtener un post por slug desde GraphQL
   */
  private async fetchPostBySlugGraphQL(slug: string): Promise<UnifiedPost | null> {
    const query = `
      query GetPostBySlug($slug: ID!) {
        post(id: $slug, idType: SLUG) {
          id
          date
          slug
          title
          excerpt
          content
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
        }
      }
    `;

    const data = await this.fetchFromGraphQL<any>(query, { slug });

    if (!data.post) return null;

    return {
      id: data.post.id,
      date: data.post.date,
      slug: data.post.slug,
      title: data.post.title,
      excerpt: data.post.excerpt,
      content: data.post.content,
      featuredImage: data.post.featuredImage,
      categories: data.post.categories?.nodes,
      category: data.post.categories?.nodes?.[0]?.name || '',
      author: {
        name: data.post.author?.node?.name || '',
        avatar: data.post.author?.node?.avatar?.url || '',
      },
    };
  }

  /**
   * Implementación específica para obtener un post por slug desde REST API
   */
  private async fetchPostBySlugREST(slug: string): Promise<UnifiedPost | null> {
    const posts = await this.fetchFromREST<any[]>('posts', {
      slug,
      _embed: 'wp:featuredmedia,author',
    });

    if (!posts || posts.length === 0) return null;

    const post = posts[0];

    return {
      id: post.id,
      date: post.date,
      slug: post.slug,
      title: {
        rendered: post.title.rendered,
      },
      excerpt: {
        rendered: post.excerpt.rendered,
      },
      content: {
        rendered: post.content.rendered,
      },
      _embedded: post._embedded,
      author: {
        name: post._embedded?.author?.[0]?.name || '',
        avatar: post._embedded?.author?.[0]?.avatar_urls?.['96'] || '',
      }
    };
  }
}

// Exportar una única instancia del servicio
const apiService = new APIService();
export default apiService; 