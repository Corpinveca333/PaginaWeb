import { createClient } from '@supabase/supabase-js';
import { normalizeDriveUrl } from './imageUtils';

// Ruta del placeholder de imagen
const PLACEHOLDER_IMAGE = '/placeholder-image.svg';

// Función para crear cliente de Supabase
const getSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

    return createClient(supabaseUrl, supabaseAnonKey);
};

/**
 * Obtiene la URL pública de una imagen almacenada en Supabase Storage
 */
export function getSupabaseImageUrl(bucket: string, path: string): string | null {
    if (!path) return null;

    // Si ya es una URL completa, devolverla sin cambios
    if (path.startsWith('http')) {
        return path;
    }

    const supabase = getSupabaseClient();
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
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
    // Si hay una imagen en Supabase, usarla
    if (supabasePath) {
        return getSupabaseImageUrl(bucket, supabasePath) || PLACEHOLDER_IMAGE;
    }

    // Si hay una URL de respaldo (Google Drive, etc.), intentar usarla
    if (backupUrl) {
        return normalizeDriveUrl(backupUrl) || PLACEHOLDER_IMAGE;
    }

    // Si no hay ninguna imagen, usar placeholder
    return PLACEHOLDER_IMAGE;
}

/**
 * Genera una URL firmada con tiempo de expiración para acceder a un archivo privado
 */
export async function getSignedUrl(bucket: string, path: string, expiresIn = 60): Promise<string | null> {
    if (!path) return null;

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

    if (error || !data) {
        console.error('Error al generar URL firmada:', error);
        return null;
    }

    return data.signedUrl;
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
}

/**
 * Elimina un archivo de Supabase Storage
 */
export async function deleteSupabaseImage(bucket: string, path: string): Promise<boolean> {
    if (!path) return false;

    const supabase = getSupabaseClient();
    const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) {
        console.error('Error al eliminar imagen:', error);
        return false;
    }

    return true;
} 