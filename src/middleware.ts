import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Verificar si la ruta está en admin/imagenes (o cualquier ruta de admin excepto la de login)
    if (req.nextUrl.pathname.startsWith('/admin') &&
        req.nextUrl.pathname !== '/admin') {

        // Comprobar si el usuario está autenticado
        const { data: { session } } = await supabase.auth.getSession();

        // Si no hay sesión, redirigir al login
        if (!session) {
            const redirectUrl = new URL('/admin', req.url);
            return NextResponse.redirect(redirectUrl);
        }
    }

    return res;
}

// Especificar en qué rutas debe ejecutarse este middleware
export const config = {
    matcher: ['/admin/:path*'],
}; 