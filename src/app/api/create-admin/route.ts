import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const requestUrl = new URL(request.url);
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const secretKey = formData.get('secret_key') as string;

        // Verificar clave secreta para proteger este endpoint
        if (secretKey !== process.env.ADMIN_SECRET_KEY) {
            return NextResponse.json(
                { error: 'Clave secreta incorrecta' },
                { status: 401 }
            );
        }

        // Crear cliente de Supabase
        const supabase = createRouteHandlerClient({ cookies });

        // Registrar al usuario
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${requestUrl.origin}/admin`,
            },
        });

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                message: 'Usuario administrador creado correctamente',
                user: data.user
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
} 