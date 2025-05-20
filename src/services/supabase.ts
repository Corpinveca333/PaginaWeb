import { supabase } from '@/lib/supabaseClient'; // Ajusta la ruta si tu cliente está en otra parte
import type { Database } from '@/types/supabase'; // Ajusta la ruta a tus tipos generados

// Tipo completo de Producto
export type Producto = Database['public']['Tables']['productos']['Row'];
// Tipo para un ítem de producto en un listado
export type ProductoListItem = Pick<
  Producto,
  'id' | 'title' | 'slug' | 'excerpt' | 'featured_image_url' | 'precio' | 'sku'
>;

// Función para obtener productos publicados con búsqueda y filtrado (listado)
export async function getAllProductosSupabase(
  searchTerm?: string,
  filterBy?: Record<string, unknown>,
  limit?: number
): Promise<Producto[]> {
  let query = supabase.from('productos').select('*').eq('is_published', true);

  if (searchTerm) {
    // Buscar en título, excerpt, y content (si existe y es público)
    // Usamos .ilike para búsqueda insensible a mayúsculas/minúsculas y % para búsqueda parcial
    query = query.or(
      `title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`
    );
  }

  // Aquí puedes añadir lógica para aplicar filtros adicionales basados en filterBy
  // Ejemplo: if (filterBy?.category) { query = query.eq('category_column', filterBy.category); }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  if (error) {
    console.error('Error fetching productos from Supabase:', error.message);
    return [];
  }
  return data || [];
}

// Función para obtener UN producto por su SLUG (detalle)
export async function getProductoBySlugSupabase(slug: string): Promise<Producto | null> {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.log(`Producto with slug "${slug}" not found.`);
      return null;
    }
    console.error(`Error fetching producto with slug ${slug} from Supabase:`, error.message);
    return null;
  }
  return data;
}

// Tipo para un Proyecto Completo
export type Proyecto = Database['public']['Tables']['proyectos']['Row'];
// Tipo para un ítem de proyecto en un listado
export type ProyectoListItem = Pick<
  Proyecto,
  | 'id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'featured_image_url'
  | 'cliente'
  | 'fecha_de_realizacion'
  | 'created_at'
>;

// Función para obtener TODOS los proyectos publicados
export async function getAllProyectosSupabase(): Promise<ProyectoListItem[]> {
  const { data, error } = await supabase
    .from('proyectos')
    .select(
      'id, title, slug, excerpt, featured_image_url, cliente, fecha_de_realizacion, created_at'
    )
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching proyectos from Supabase:', error.message);
    return [];
  }
  return data || [];
}

// Función para obtener UN proyecto por su SLUG
export async function getProyectoBySlugSupabase(slug: string): Promise<Proyecto | null> {
  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.log(`Proyecto with slug "${slug}" not found.`);
      return null;
    }
    console.error(`Error fetching proyecto with slug ${slug} from Supabase:`, error.message);
    return null;
  }
  return data;
}

// Tipo para un Servicio Completo
export type Servicio = Database['public']['Tables']['servicios']['Row'];
// Tipo para un ítem de servicio en un listado
export type ServicioListItem = Pick<
  Servicio,
  'id' | 'title' | 'slug' | 'excerpt' | 'featured_image_url' | 'icono_url' | 'precio' | 'created_at'
>;

// Función para obtener servicios publicados con búsqueda y filtrado (listado)
export async function getAllServiciosSupabase(
  searchTerm?: string,
  filterBy?: Record<string, unknown>,
  limit?: number
): Promise<ServicioListItem[]> {
  let query = supabase
    .from('servicios')
    .select('id, title, slug, excerpt, featured_image_url, icono_url, precio, created_at')
    .eq('is_published', true);

  if (searchTerm) {
    // Buscar en título, excerpt, y content (si existe y es público)
    query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`);
    // Si quisieras buscar en content (columna no seleccionada en el listado, pero podría ser relevante para búsqueda)
    // query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
  }

  // Aquí puedes añadir lógica para aplicar filtros adicionales basados en filterBy
  // Ejemplo: if (filterBy?.area) { query = query.eq('area_column', filterBy.area); }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  if (error) {
    console.error('Error fetching all servicios from Supabase:', error.message);
    return [];
  }
  return data || [];
}

// Función para obtener UN servicio por su SLUG
export async function getServicioBySlugSupabase(slug: string): Promise<Servicio | null> {
  const { data, error } = await supabase
    .from('servicios')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      console.log(`Servicio with slug "${slug}" not found.`);
      return null;
    }
    console.error(`Error fetching servicio with slug ${slug} from Supabase:`, error.message);
    return null;
  }
  return data;
}

// Tipo para una Página Estática
export type PaginaEstatica = Database['public']['Tables']['paginas_estaticas']['Row'];

// Función para obtener UNA página estática por su SLUG
export async function getPaginaBySlugSupabase(slug: string): Promise<PaginaEstatica | null> {
  const { data, error } = await supabase
    .from('paginas_estaticas')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.log(`Página estática con slug "${slug}" no encontrada.`);
      return null;
    }
    console.error(`Error al obtener página estática con slug ${slug} de Supabase:`, error.message);
    return null;
  }
  return data;
}
