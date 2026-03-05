import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Retorna um cliente "vazio" ou loga o aviso durante o build da Vercel
    console.warn("Supabase credentials missing! Check your Environment Variables.");
  }

  return createBrowserClient(
    supabaseUrl || "",
    supabaseKey || ""
  )
}
