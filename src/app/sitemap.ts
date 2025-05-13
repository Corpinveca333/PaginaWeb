import { MetadataRoute } from 'next';
import { getServices, getProducts, getAllProyectos } from '@/services/wordpress';

// Asegúrate de que las interfaces/tipos para los nodos también estén disponibles si las necesitas aquí,
// aunque para el sitemap solo usaremos 'slug' y 'date' o 'modified' de ellos.
// import type { ServicioNode, ProductoNode, ProyectoNode } from '@/services/wordpress';

// Defino un tipo para las frecuencias de cambio válidas en Next.js
type ChangeFrequency = 'yearly' | 'monthly' | 'weekly' | 'always' | 'hourly' | 'daily' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.corpinveca.com'; // Tu dominio oficial

  // 1. URLs de páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/quienes-somos`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/solicitud`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.6,
    },
    // Añade aquí otras páginas estáticas que tengas
  ];

  // 2. URLs de páginas de listado de CPTs
  const listPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/servicios`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/proyectos`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.7,
    },
  ];

  // 3. URLs dinámicas para detalles de Servicios
  const services = await getServices();
  const serviceUrls: MetadataRoute.Sitemap = services.map(servicio => ({
    url: `${baseUrl}/servicios/${servicio.slug}`,
    lastModified: servicio.date ? new Date(servicio.date) : new Date(),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.9,
  }));

  // 4. URLs dinámicas para detalles de Productos
  const products = await getProducts();
  const productUrls: MetadataRoute.Sitemap = products.map(producto => ({
    url: `${baseUrl}/productos/${producto.slug}`,
    lastModified: producto.date ? new Date(producto.date) : new Date(),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.9,
  }));

  // 5. URLs dinámicas para detalles de Proyectos
  const proyectos = await getAllProyectos();
  const proyectoUrls: MetadataRoute.Sitemap = proyectos
    ? proyectos.map(proyecto => ({
        url: `${baseUrl}/proyectos/${proyecto.slug}`,
        lastModified: proyecto.date ? new Date(proyecto.date) : new Date(),
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: 0.9,
      }))
    : [];

  return [...staticPages, ...listPages, ...serviceUrls, ...productUrls, ...proyectoUrls];
}
