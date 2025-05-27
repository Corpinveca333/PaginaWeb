import { createClient } from '@supabase/supabase-js';
import { normalizeDriveUrl } from './imageUtils';

// Ruta del placeholder de imagen
const PLACEHOLDER_IMAGE = '/placeholder-image.svg';

// Función para crear cliente de Supabase
const getSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Error: Variables de entorno de Supabase no definidas');
        return null;
    }

    return createClient(supabaseUrl, supabaseAnonKey);
};

/**
 * Obtiene la URL pública de una imagen almacenada en Supabase Storage
 */
export function getSupabaseImageUrl(bucket: string, path: string): string | null {
    if (!path) return null;

    // Si ya es una URL completa de Supabase Storage, devolverla sin cambios
    if (path.includes('supabase.co/storage/v1/object/public')) {
        console.log('URL de Supabase detectada, devolviendo tal cual:', path);
        return path;
    }

    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        console.log('URL generada para Supabase Storage:', data.publicUrl);
        return data.publicUrl;
    } catch (error) {
        console.error('Error al obtener URL pública de Supabase:', error);
        return null;
    }
}

/**
 * Combina diferentes fuentes de imágenes (Supabase, Google Drive, etc.)
 * Prioriza imágenes de Supabase, pero permite usar Google Drive como respaldo
 */
export function getOptimizedImageUrl(
    supabasePath: string | null,
    backupUrl: string | null = null,
    bucket: string = 'imagenes_servicios'
): string {
    console.log('getOptimizedImageUrl - supabasePath:', supabasePath, 'backupUrl:', backupUrl);

    // Si hay una imagen en Supabase, usarla
    if (supabasePath) {
        // Si ya es una URL completa de Supabase, devolverla directamente
        if (supabasePath.includes('supabase.co/storage/v1/object/public')) {
            console.log('Usando URL de Supabase directamente:', supabasePath);
            return supabasePath;
        }

        const supabaseUrl = getSupabaseImageUrl(bucket, supabasePath);
        if (supabaseUrl) {
            console.log('URL de Supabase generada:', supabaseUrl);
            return supabaseUrl;
        }

        console.log('No se pudo generar URL de Supabase, usando placeholder');
        return PLACEHOLDER_IMAGE;
    }

    // Si hay una URL de respaldo (Google Drive, etc.), intentar usarla
    if (backupUrl) {
        const normalizedUrl = normalizeDriveUrl(backupUrl);
        if (normalizedUrl) {
            console.log('Usando URL normalizada:', normalizedUrl);
            return normalizedUrl;
        }

        console.log('No se pudo normalizar la URL de respaldo, usando placeholder');
        return PLACEHOLDER_IMAGE;
    }

    // Si no hay ninguna imagen, usar placeholder
    console.log('No hay URL disponible, usando placeholder');
    return PLACEHOLDER_IMAGE;
}

/**
 * Genera una URL firmada con tiempo de expiración para acceder a un archivo privado
 */
export async function getSignedUrl(bucket: string, path: string, expiresIn = 60): Promise<string | null> {
    if (!path) return null;

    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);

        if (error || !data) {
            console.error('Error al generar URL firmada:', error);
            return null;
        }

        return data.signedUrl;
    } catch (error) {
        console.error('Error inesperado al generar URL firmada:', error);
        return null;
    }
}

/**
 * Sube un archivo a Supabase Storage y devuelve su URL pública
 */
export async function uploadImageToSupabase(
    bucket: string,
    path: string,
    file: File
): Promise<string | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
        // Subir archivo
        const { error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Error al subir imagen:', error);
            return null;
        }

        // Obtener URL pública
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    } catch (error) {
        console.error('Error inesperado al subir imagen:', error);
        return null;
    }
}

/**
 * Elimina un archivo de Supabase Storage
 */
export async function deleteSupabaseImage(bucket: string, path: string): Promise<boolean> {
    if (!path) return false;

    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            console.error('Error al eliminar imagen:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error inesperado al eliminar imagen:', error);
        return false;
    }
} 