import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Public client (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client (service role key — server-side only, never expose to browser)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

