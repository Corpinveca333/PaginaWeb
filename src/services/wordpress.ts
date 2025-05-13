// src/services/wordpress.ts

// Interfaz para el resultado de GraphQL
export interface WPGraphQLResponse<DataType> {
  data?: DataType;
  errors?: Array<{ message: string; [key: string]: any }>;
}

// Interfaz para páginas de WordPress
export interface WpPage {
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  date?: string | null;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string | null;
    };
  } | null;
  // Puedes añadir más campos si los necesitas en el futuro
}

// Función genérica para hacer peticiones GraphQL a WPGraphQL
export async function fetchGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>,
  options?: { revalidate?: number }
): Promise<T | null> {
  const graphqlEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT;

  if (!graphqlEndpoint) {
    console.error('Error: NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT no está definida.');
    return null;
  }

  try {
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
    });

    if (!response.ok) {
      console.error(`Error HTTP en fetchGraphQL: ${response.status} ${response.statusText}`);
      const errorBody = await response.text().catch(() => 'No se pudo leer el cuerpo del error.');
      console.error('Cuerpo del error HTTP:', errorBody);
      return null;
    }

    const jsonResponse: WPGraphQLResponse<T> = await response.json();

    if (jsonResponse.errors && jsonResponse.errors.length > 0) {
      console.error(
        '[GraphQL Server Errors] en fetchGraphQL:',
        JSON.stringify(jsonResponse.errors, null, 2)
      );
      return null;
    }

    if (!jsonResponse.data) {
      console.warn(
        '[fetchGraphQL] La respuesta no contiene jsonResponse.data, pero tampoco errores explícitos de GraphQL. Respuesta:',
        jsonResponse
      );
      return null;
    }

    return jsonResponse.data as T;
  } catch (error) {
    console.error('[Error Crítico] en fetchGraphQL:', error);
    return null;
  }
}

// Interfaz para la imagen destacada
interface FeaturedImageNode {
  sourceUrl: string;
  altText?: string;
}

// Interfaz para el nodo de imagen destacada
interface FeaturedImage {
  node: FeaturedImageNode;
}

// Interfaz para el icono del servicio (campo ACF)
interface IconoServicioNode {
  sourceUrl: string;
  altText?: string;
}

interface IconoServicio {
  node?: IconoServicioNode;
}

// Interfaz para los campos ACF del Servicio
interface CamposDeServicio {
  alcanceDelServicio?: string;
  iconoDelServicio?: IconoServicio;
}

// Interfaz para un Servicio
export interface Servicio {
  id: string;
  title: string;
  slug: string;
  date?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string | null;
    };
  } | null;
  camposDeServicio?: {
    alcanceDelServicio?: string | null;
    iconoDelServicio?: {
      node: {
        id: string;
        sourceUrl: string;
        altText?: string | null;
      };
    } | null;
    precio?: number | null;
  } | null;
}

// Interfaz para la respuesta de GraphQL para Servicios
interface WPGraphQLServiciosResponse {
  servicios: {
    nodes: Servicio[];
  };
}

// Función para obtener todos los servicios usando GraphQL
export async function getServices(): Promise<Servicio[]> {
  const query = `
    query GetServicios {
      servicios {
        nodes {
          id
          title
          slug
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          camposDeServicio {
            alcanceDelServicio
            iconoDelServicio {
              node {
                id
                sourceUrl
                altText
              }
            }
            precio
          }
        }
      }
    }
  `;
  try {
    const data = await fetchGraphQL<WPGraphQLServiciosResponse>(query, undefined, {
      revalidate: 3600,
    });
    return data?.servicios?.nodes || [];
  } catch (error) {
    console.error('Error al obtener los servicios:', error);
    return [];
  }
}

// Interfaz para los campos ACF del Producto
interface CamposDeProducto {
  numeroDeParteSku?: string;
  precio?: string;
  // Puedes añadir aquí otros campos ACF validados, por ejemplo:
  // descripcionLargaProducto?: string;
  // especificacionesProducto?: string;
}

// Interfaz para un Producto
export interface ProductPost {
  id: string;
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: FeaturedImage;
  camposDeProducto?: CamposDeProducto;
}

// Interfaz para la respuesta de GraphQL para Productos
interface WPGraphQLProductosResponse {
  productos: {
    nodes: ProductPost[];
  };
}

// Función para obtener todos los productos usando GraphQL
export async function getProducts(): Promise<ProductPost[]> {
  const query = `
    query GetProducts {
      productos {
        nodes {
          id
          title
          slug
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          excerpt
          camposDeProducto {
            numeroDeParteSku
            precio
          }
        }
      }
    }
  `;
  try {
    const data = await fetchGraphQL<WPGraphQLProductosResponse>(query, undefined, {
      revalidate: 3600,
    });
    return data?.productos?.nodes || [];
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return [];
  }
}

// Función para obtener un servicio individual por slug usando GraphQL
export async function getServiceBySlug(slug: string): Promise<Servicio | null> {
  console.log('[API FETCHING] getServiceBySlug: Recibido slug =', slug);
  const query = `
    query GetServiceBySlug($slug: ID!) {
      servicio(id: $slug, idType: SLUG) {
        id
        title
        slug
        content
        date
        featuredImage { node { sourceUrl altText } }
        camposDeServicio { 
          alcanceDelServicio 
          iconoDelServicio { node { id sourceUrl altText } }
          precio 
        }
      }
    }
  `;
  try {
    console.log('[API FETCHING] getServiceBySlug: Ejecutando query para slug =', slug);
    const data = await fetchGraphQL<{ servicio: Servicio | null }>(query, { slug });

    if (!data || !data.servicio) {
      return null;
    }
    return data.servicio;
  } catch (error) {
    console.error(
      '[API FETCHING ERROR INESPERADO] getServiceBySlug falló para slug =',
      slug,
      error
    );
    return null;
  }
}

export interface ServicioNode {
  id: string;
  title: string;
  slug: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string | null;
    };
  } | null;
  camposDeServicio?: {
    alcanceDelServicio?: string | null;
    iconoDelServicio?: {
      node: {
        id: string;
        sourceUrl: string;
        altText?: string | null;
      };
    } | null;
    precio?: number | null;
  } | null;
}

// Interfaz Producto
export interface Producto {
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  excerpt?: string | null;
  date?: string | null;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string | null;
    };
  } | null;
  camposDeProducto?: {
    numeroDeParteSku?: string | null;
    descripcionLarga?: string | null;
    especificacionesTecnicas?: string | null;
    precio?: number | null;
    imagenPrincipalDelProducto?: {
      node: {
        id: string;
        sourceUrl: string;
        altText?: string | null;
      };
    } | null;
  } | null;
}

// Función para obtener un producto individual por slug usando GraphQL
export async function getProductBySlug(slug: string): Promise<Producto | null> {
  console.log('[API FETCHING] getProductBySlug: Recibido slug =', slug);
  const query = `
    query GetProductBySlug($slug: ID!) {
      producto(id: $slug, idType: SLUG) {
        id
        title
        slug
        content(format: RENDERED)
        excerpt(format: RENDERED)
        date
        featuredImage { node { sourceUrl altText } }
        camposDeProducto {
          numeroDeParteSku
          descripcionLarga
          especificacionesTecnicas
          precio
          imagenPrincipalDelProducto { node { id sourceUrl altText } }
        }
      }
    }
  `;
  try {
    console.log('[API FETCHING] getProductBySlug: Ejecutando query para slug =', slug);
    const data = await fetchGraphQL<{ producto: Producto | null }>(
      query,
      { slug },
      { revalidate: 86400 }
    );

    if (!data || !data.producto) {
      return null;
    }
    return data.producto;
  } catch (error) {
    console.error(
      '[API FETCHING ERROR INESPERADO] getProductBySlug falló para slug =',
      slug,
      error
    );
    return null;
  }
}

// Interfaz para un nodo de proyecto
export interface ProyectoNode {
  id: string;
  title: string;
  slug: string;
  date?: string | null;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string | null;
    };
  } | null;
  camposDeProyecto?: {
    cliente?: string | null;
    fechaDeRealizacion?: string | null;
    detallesalcanceDelProyecto?: string | null;
    galeriaDeImagenes?: {
      node: {
        id: string;
        sourceUrl: string;
        altText?: string | null;
      };
    } | null;
  } | null;
}

// Función para obtener todos los proyectos
export async function getAllProyectos(): Promise<ProyectoNode[]> {
  const query = `
    query GetAllProyectos {
      proyectos(first: 100) {
        nodes {
          id
          title
          slug
          date
          excerpt(format: RENDERED)
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          camposDeProyecto {
            cliente
            fechaDeRealizacion
          }
        }
      }
    }
  `;
  try {
    const data = await fetchGraphQL<{ proyectos: { nodes: ProyectoNode[] } | null }>(
      query,
      undefined,
      { revalidate: 3600 }
    );
    return data?.proyectos?.nodes || [];
  } catch (error) {
    console.error('Error al obtener todos los proyectos:', error);
    return [];
  }
}

export async function getProyectoBySlug(slug: string): Promise<ProyectoNode | null> {
  console.log('[API FETCHING] getProyectoBySlug: Recibido slug =', slug);
  const query = `
    query GetProyectoBySlug($slug: ID!) {
      proyecto(id: $slug, idType: SLUG) {
        id
        title
        slug
        date
        content(format: RENDERED)
        featuredImage { node { sourceUrl altText } }
        camposDeProyecto {
          cliente
          fechaDeRealizacion
          detallesalcanceDelProyecto
          galeriaDeImagenes { node { id sourceUrl altText } }
        }
      }
    }
  `;
  try {
    console.log('[API FETCHING] getProyectoBySlug: Ejecutando query para slug =', slug);
    const data = await fetchGraphQL<{ proyecto: ProyectoNode | null }>(query, { slug });

    if (!data || !data.proyecto) {
      return null;
    }
    return data.proyecto;
  } catch (error) {
    console.error(
      '[API FETCHING ERROR INESPERADO] getProyectoBySlug falló para slug =',
      slug,
      error
    );
    return null;
  }
}

// Función para obtener una página por URI usando GraphQL
export async function getPageByUri(uri: string): Promise<WpPage | null> {
  const query = `
    query GetPageByUri($id: ID!) {
      page(id: $id, idType: URI) {
        id
        title
        slug
        content(format: RENDERED)
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<{ page: WpPage | null }>(query, { id: uri });
    return data?.page || null;
  } catch (error) {
    console.error('Error al obtener la página por URI:', error);
    return null;
  }
}
