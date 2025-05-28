import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // Ajusta la ruta a tu archivo de tipos generado
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Supabase URL is not defined. Check your .env.local file.');
}
if (!supabaseAnonKey) {
  throw new Error('Supabase anon key is not defined. Check your .env.local file.');
}

// Crea y exporta el cliente Supabase con tipado
// Usamos el tipo Database que generaste para tener autocompletado y seguridad de tipos
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
