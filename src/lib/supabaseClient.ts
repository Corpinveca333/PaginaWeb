import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // Ajusta la ruta a tu archivo de tipos generado

// Usar variables de entorno o valores hardcodeados para desarrollo local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ymntsjedzdgalrjuzbgk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbnRzamVkemRnYWxyanV6YmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Njg3MDEsImV4cCI6MjA2MzI0NDcwMX0.FALvkPMVVF_1fCrH4Sx7d0Q2jULQTz80g7tyi_Q8wTw';

// Crea y exporta el cliente Supabase con tipado
// Usamos el tipo Database que generaste para tener autocompletado y seguridad de tipos
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
