import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint para hacer proxy de imágenes de Google Drive y otros servicios problemáticos
 * Uso: /api/image-proxy?url=https://drive.google.com/uc?id=XXXX
 */
export async function GET(request: NextRequest) {
    // Obtener URL de la consulta
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
        return new NextResponse('URL parameter is required', { status: 400 });
    }

    try {
        // Normalizar URL de Google Drive si es necesario
        let imageUrl = url;

        if (url.includes('drive.google.com/file/d/')) {
            const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                imageUrl = `https://drive.google.com/uc?id=${idMatch[1]}`;
            }
        }

        // Hacer la solicitud a la URL
        const response = await fetch(imageUrl, {
            headers: {
                // Algunos headers importantes para evitar restricciones
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }

        // Obtener el tipo de contenido
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        // Obtener el buffer de la imagen
        const buffer = await response.arrayBuffer();

        // Devolver la imagen con los headers adecuados
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400', // Cachear por 24 horas
            },
        });
    } catch (error) {
        console.error('Error proxying image:', error);
        return new NextResponse('Error fetching image', { status: 500 });
    }
} 