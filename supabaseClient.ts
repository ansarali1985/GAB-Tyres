
import { createClient } from '@supabase/supabase-js';

// These will be provided via Vercel Environment Variables or the Admin Settings
// Use type assertion to any to access Vite's env property on import.meta
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
// Use type assertion to any to access Vite's env property on import.meta
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
