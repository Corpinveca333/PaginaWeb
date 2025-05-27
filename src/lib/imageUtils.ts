/**
 * Utilidades para manejo de imágenes
 */

/**
 * Convierte una URL de Google Drive al formato correcto para imágenes
 * Soporta tanto URLs con formato /uc?id= como enlaces completos compartidos
 * Usa un método alternativo que es más compatible con Next.js y Vercel
 */
export function normalizeDriveUrl(url: string | null | undefined): string | null {
    if (!url) return null; // No fallback, si no hay URL, devolver null

    // Si es una URL local, devolverla sin cambios
    if (url.startsWith('/')) {
        return url;
    }

    // Detectar si es una URL de Google Drive
    if (url.includes('drive.google.com')) {
        // Extraer el ID del archivo, ya sea formato /uc?id= o /file/d/
        let fileId = '';

        if (url.includes('drive.google.com/uc?id=')) {
            // Ya tiene el formato uc?id=
            const idMatch = url.match(/id=([^&]+)/);
            if (idMatch && idMatch[1]) {
                fileId = idMatch[1];
            }
        } else if (url.includes('drive.google.com/file/d/')) {
            // Formato de compartir
            const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                fileId = idMatch[1];
            }
        }

        if (fileId) {
            // Usar un formato alternativo más compatible con Vercel
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
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
    if (!url) return '/placeholder-image.svg';

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