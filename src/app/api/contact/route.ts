import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types/supabase';

type Contacto = Database['public']['Tables']['contactos']['Insert'];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, mensaje } = body;

    // Validación básica
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { message: 'Por favor, completa todos los campos requeridos.' },
        { status: 400 }
      );
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Por favor, proporciona un correo electrónico válido.' },
        { status: 400 }
      );
    }

    // Insertar en Supabase
    const contacto: Contacto = {
      nombre,
      email,
      telefono: telefono || null,
      mensaje,
      estado: 'nuevo',
    };

    const { error } = await supabase.from('contactos').insert([contacto]);

    if (error) {
      console.error('Error al guardar el contacto en Supabase:', error);
      return NextResponse.json(
        { message: 'Error al procesar tu mensaje. Por favor, intenta nuevamente.' },
        { status: 500 }
      );
    }

    // Enviar email de notificación (implementar según necesidad)
    // TODO: Implementar envío de email

    return NextResponse.json({ message: 'Mensaje recibido correctamente.' }, { status: 200 });
  } catch (error) {
    console.error('Error en el endpoint de contacto:', error);
    return NextResponse.json(
      { message: 'Error al procesar tu mensaje. Por favor, intenta nuevamente.' },
      { status: 500 }
    );
  }
}
