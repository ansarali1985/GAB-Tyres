import { createClient } from '@supabase/supabase-js';

// Vite exposes env via import.meta.env and requires VITE_ prefix for client-side variables
const env = (import.meta as any).env;
const supabaseUrl = env?.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Set them in your .env (for local dev) and in Vercel Project Settings (Environment Variables).'
  );
  // Optional: show a user-friendly message in dev
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-alert
    // alert('Supabase keys missing — check console for details.');
  }
}

// Always export a client object to avoid null usage elsewhere.
// createClient will attach headers when keys are present.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
