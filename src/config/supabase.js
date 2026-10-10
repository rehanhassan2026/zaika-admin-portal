import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://akkahprtcttznhhdvgcb.supabase.co'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFra2FocHJ0Y3R0em5oaGR2Z2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NjAwNDcsImV4cCI6MjEwNzEzNjA0N30.MLJiXqbwEUxmilB4gp4INg2_6SDsquhMnN_WoxuhqJ4'
export const ADMIN_EMAIL = 'sandhucosmetics1@gmail.com'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
