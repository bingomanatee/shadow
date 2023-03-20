import { createClient } from '@supabase/supabase-js'
const key: string = process.env.SERVICE_PASSWORD || '';
const url: string = process.env.SUPABASE_URL || '';

export function getSupabase() {
  return createClient(url, key);
}
