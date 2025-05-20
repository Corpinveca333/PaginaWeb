import { MetadataRoute } from 'next';
import {
  getAllServiciosSupabase,
  getAllProductosSupabase,
  getAllProyectosSupabase,
} from '@/services/supabase';
import type { ServicioListItem, Producto, ProyectoListItem } from '@/services/supabase';

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
  const services = await getAllServiciosSupabase();
  const serviceUrls: MetadataRoute.Sitemap = services.map(servicio => ({
    url: `${baseUrl}/servicios/${servicio.slug}`,
    lastModified: servicio.created_at ? new Date(servicio.created_at) : new Date(),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.9,
  }));

  // 4. URLs dinámicas para detalles de Productos
  const products = await getAllProductosSupabase();
  const productUrls: MetadataRoute.Sitemap = products.map(producto => ({
    url: `${baseUrl}/productos/${producto.slug}`,
    lastModified: producto.created_at ? new Date(producto.created_at) : new Date(),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.9,
  }));

  // 5. URLs dinámicas para detalles de Proyectos
  const proyectos = await getAllProyectosSupabase();
  const proyectoUrls: MetadataRoute.Sitemap = proyectos
    ? proyectos.map(proyecto => ({
        url: `${baseUrl}/proyectos/${proyecto.slug}`,
        lastModified: proyecto.created_at ? new Date(proyecto.created_at) : new Date(),
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: 0.9,
      }))
    : [];

  return [...staticPages, ...listPages, ...serviceUrls, ...productUrls, ...proyectoUrls];
}
