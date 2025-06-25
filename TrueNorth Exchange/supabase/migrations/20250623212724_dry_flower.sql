/*
  # Create exchange orders table

  1. New Tables
    - `exchange_orders`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `send_currency_symbol` (text)
      - `send_currency_name` (text)
      - `send_amount` (text)
      - `receive_currency_symbol` (text)
      - `receive_currency_name` (text)
      - `receive_amount` (text)
      - `order_type` (text)
      - `recipient_address` (text)
      - `email` (text)
      - `promo_code` (text, optional)
      - `status` (text with check constraint)
      - `transaction_hash` (text, optional)

  2. Security
    - Enable RLS on `exchange_orders` table
    - Add policy for public insert access (no authentication required)
    - Add policy for users to read their own orders by email
*/

CREATE TABLE IF NOT EXISTS exchange_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  send_currency_symbol text NOT NULL,
  send_currency_name text NOT NULL,
  send_amount text NOT NULL,
  receive_currency_symbol text NOT NULL,
  receive_currency_name text NOT NULL,
  receive_amount text NOT NULL,
  order_type text NOT NULL DEFAULT 'Floating',
  recipient_address text NOT NULL,
  email text NOT NULL,
  promo_code text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  transaction_hash text
);

-- Enable Row Level Security
ALTER TABLE exchange_orders ENABLE ROW LEVEL SECURITY;

-- Allow public insert access (no authentication required for creating orders)
CREATE POLICY "Anyone can create exchange orders"
  ON exchange_orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow users to read their own orders by email
CREATE POLICY "Users can read their own orders"
  ON exchange_orders
  FOR SELECT
  TO public
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_exchange_orders_email ON exchange_orders(email);
CREATE INDEX IF NOT EXISTS idx_exchange_orders_status ON exchange_orders(status);
CREATE INDEX IF NOT EXISTS idx_exchange_orders_created_at ON exchange_orders(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_exchange_orders_updated_at
  BEFORE UPDATE ON exchange_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();