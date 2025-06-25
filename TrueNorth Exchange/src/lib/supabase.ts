import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Provide fallback values for development to prevent errors
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Export types for TypeScript
export interface ExchangeOrder {
  id?: string
  send_currency_symbol: string
  send_currency_name: string
  send_amount: string
  receive_currency_symbol: string
  receive_currency_name: string
  receive_amount: string
  order_type: string
  recipient_address: string
  email: string
  promo_code?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at?: string
  updated_at?: string
}

export { supabase }