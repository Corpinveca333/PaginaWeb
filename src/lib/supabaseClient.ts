console.log('--- DEBUGGING ENV VARS ---');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
Object.keys(process.env).forEach(key => {
  if (key.startsWith('NEXT_PUBLIC_')) {
    console.log(`${key}:`, process.env[key]);
  }
});
console.log('--- FIN DEBUGGING ENV VARS ---');

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
