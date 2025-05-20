import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { Producto, Proyecto, Servicio } from '@/types/supabase';
import slugify from 'slugify';

// Validar el contentType
const isValidContentType = (type: string): type is 'productos' | 'proyectos' | 'servicios' => {
  return ['productos', 'proyectos', 'servicios'].includes(type);
};

// Función para extraer datos de la página
const pageFunction = `
async function pageFunction(context) {
  const { $, request, log } = context;
  
  // Extraer título
  const title = $('meta[property="og:title"]').attr('content') || 
                $('h1').first().text().trim() || 
                $('title').text().trim();
  
  // Extraer contenido
  const content = $('article').text().trim() || 
                 $('.entry-content').text().trim() || 
                 $('.post-content').text().trim();
  
  // Extraer excerpt
  const excerpt = $('meta[name="description"]').attr('content') || 
                 $('meta[property="og:description"]').attr('content') || 
                 content.substring(0, 200);
  
  // Extraer imagen destacada
  const featured_image_url = $('meta[property="og:image"]').attr('content') || 
                           $('.featured-image img').attr('src') || 
                           $('article img').first().attr('src');
  
  // Extraer campos específicos según el tipo de contenido
  const precio = $('.price').text().trim();
  const sku = $('.sku').text().trim();
  const cliente = $('.client').text().trim();
  const fecha_de_realizacion = $('.date').text().trim();
  const alcance_del_servicio = $('.scope').text().trim();
  const icono_url = $('.icon').attr('src');
  
  return {
    title,
    content,
    excerpt,
    featured_image_url,
    precio,
    sku,
    cliente,
    fecha_de_realizacion,
    alcance_del_servicio,
    icono_url
  };
}
`;

export async function POST(request: Request) {
  try {
    const { urlToScrape, contentType } = await request.json();

    // Validar inputs
    if (!urlToScrape || !contentType) {
      return NextResponse.json(
        { success: false, error: 'urlToScrape y contentType son requeridos' },
        { status: 400 }
      );
    }

    if (!isValidContentType(contentType)) {
      return NextResponse.json(
        { success: false, error: 'contentType debe ser "productos", "proyectos" o "servicios"' },
        { status: 400 }
      );
    }

    // Inicializar cliente Apify
    const client = new ApifyClient({
      token: process.env.APIFY_API_KEY,
    });

    // Configurar y ejecutar el actor
    const run = await client.actor('apify/cheerio-scraper').call({
      startUrls: [{ url: urlToScrape }],
      pageFunction,
      proxyConfiguration: {
        useApifyProxy: true,
      },
    });

    // Obtener resultados
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    const scrapedData = items[0];

    if (!scrapedData) {
      return NextResponse.json(
        { success: false, error: 'No se pudo extraer datos de la página' },
        { status: 500 }
      );
    }

    // Generar slug
    const slug = slugify(scrapedData.title, { lower: true, strict: true });

    // Preparar datos para Supabase según el tipo de contenido
    const dataToInsert = {
      title: scrapedData.title,
      slug,
      content: scrapedData.content,
      excerpt: scrapedData.excerpt,
      featured_image_url: scrapedData.featured_image_url,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Añadir campos específicos según el tipo
    if (contentType === 'productos') {
      Object.assign(dataToInsert, {
        precio: scrapedData.precio ? parseFloat(scrapedData.precio) : null,
        sku: scrapedData.sku || null,
      });
    } else if (contentType === 'proyectos') {
      Object.assign(dataToInsert, {
        cliente: scrapedData.cliente || null,
        fecha_de_realizacion: scrapedData.fecha_de_realizacion || null,
      });
    } else if (contentType === 'servicios') {
      Object.assign(dataToInsert, {
        alcance_del_servicio: scrapedData.alcance_del_servicio || null,
        icono_url: scrapedData.icono_url || null,
      });
    }

    // Insertar en Supabase
    const { data, error } = await supabaseAdmin
      .from(contentType)
      .insert(dataToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error al insertar en Supabase:', error);
      return NextResponse.json(
        { success: false, error: 'Error al guardar en la base de datos' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error en el proceso de scraping:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
