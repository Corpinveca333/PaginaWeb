import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const supabase = createRouteHandlerClient({ cookies });

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${request.headers.get('origin')}/admin`,
            },
        });

        if (error) {
            console.error('Error de registro:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Añadir a la tabla admin_users (esto normalmente lo haría un trigger, pero vamos a hacerlo explícitamente)
        if (data.user) {
            const { error: insertError } = await supabase
                .from('admin_users')
                .insert([{ id: data.user.id, email: data.user.email }]);

            if (insertError) {
                console.error('Error al añadir usuario a admin_users:', insertError);
            }
        }

        return NextResponse.json({ success: true, user: data.user });
    } catch (error: any) {
        console.error('Error inesperado:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 