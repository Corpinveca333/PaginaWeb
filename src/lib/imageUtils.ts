/**
 * Utilidades para manejo de imágenes
 */

/**
 * Convierte una URL de Google Drive al formato correcto para imágenes
 * Soporta tanto URLs con formato /uc?id= como enlaces completos compartidos
 */
export function normalizeDriveUrl(url: string | null | undefined): string | null {
    if (!url) return null; // No fallback, si no hay URL, devolver null

    // Si es una URL local, devolverla sin cambios
    if (url.startsWith('/')) {
        return url;
    }

    // Si ya tiene el formato correcto, devolverlo tal cual
    if (url.includes('drive.google.com/uc?id=')) {
        // Asegurarse de que tenga el parámetro export=view
        if (!url.includes('export=view')) {
            return `${url}&export=view`;
        }
        return url;
    }

    // Si es una URL de Google Drive en formato de compartir
    if (url.includes('drive.google.com/file/d/')) {
        // Extraer el ID del archivo
        const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
            const fileId = idMatch[1];
            // Usar directamente la URL de Google Drive con export=view
            return `https://drive.google.com/uc?id=${fileId}&export=view`;
        }
    }

    // Para cualquier otro caso, devolver la URL original
    return url;
}

/**
 * Devuelve una URL para imágenes de servicios externos
 * Ya no usa el proxy de imágenes eliminado, sino que devuelve la URL normalizada directamente
 */
export function getProxyImageUrl(url: string): string {
    if (!url) return '/placeholder-service-image.jpg';

    // Si ya es una URL local, devolverla tal cual
    if (url.startsWith('/')) {
        return url;
    }

    // Para URLs de Google Drive, usar la función de normalización
    if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
        return normalizeDriveUrl(url) || url;
    }

    // Para cualquier otro caso, devolver la URL original
    return url;
}

/**
 * Verifica si una URL debe tratarse como no optimizada en Next.js Image
 */
export function shouldSkipOptimization(url: string | null | undefined): boolean {
    if (!url) return false;

    // No optimizar imágenes de Google Drive
    if (url.includes('drive.google.com')) {
        return true;
    }

    // No optimizar imágenes de otros servicios externos conocidos por causar problemas
    if (url.includes('googleusercontent.com')) {
        return true;
    }

    return false;
} 