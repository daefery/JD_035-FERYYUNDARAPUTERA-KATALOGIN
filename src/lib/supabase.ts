import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Get environment variables with explicit fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Debug logging (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Supabase Environment Variables:', {
    url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'NOT SET',
    key: supabaseAnonKey ? 'SET' : 'NOT SET'
  })
}

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:', {
    url: supabaseUrl ? 'SET' : 'MISSING',
    key: supabaseAnonKey ? 'SET' : 'MISSING'
  })
}

// Client-side Supabase client
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
)

// Server-side Supabase client (for API routes)
export const createServerClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables not found')
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
