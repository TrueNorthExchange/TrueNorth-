/*
  # Telegram Notification Integration

  1. Extensions
    - Enable pg_net extension for HTTP requests
  
  2. Functions
    - Create function to send Telegram notifications via edge function
  
  3. Triggers
    - Create trigger to automatically notify Telegram on new orders
  
  4. Security
    - Grant necessary permissions for HTTP requests
*/

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to call Telegram notification edge function
CREATE OR REPLACE FUNCTION notify_telegram_on_new_order()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url text;
  service_role_key text;
BEGIN
  -- Get Supabase URL and service role key from environment
  -- These should be set in your Supabase project settings
  supabase_url := current_setting('app.supabase_url', true);
  service_role_key := current_setting('app.supabase_service_role_key', true);
  
  -- Only proceed if we have the required settings
  IF supabase_url IS NOT NULL AND service_role_key IS NOT NULL THEN
    -- Call the edge function asynchronously using pg_net extension
    PERFORM
      net.http_post(
        url := supabase_url || '/functions/v1/telegram-notifications',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || service_role_key
        ),
        body := jsonb_build_object('record', row_to_json(NEW))
      );
  ELSE
    -- Log that notification couldn't be sent (optional)
    RAISE NOTICE 'Telegram notification not sent: missing configuration';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after INSERT on exchange_orders
DROP TRIGGER IF EXISTS trigger_telegram_notification ON exchange_orders;
CREATE TRIGGER trigger_telegram_notification
  AFTER INSERT ON exchange_orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_telegram_on_new_order();

-- Grant necessary permissions for the net schema and functions
DO $$
BEGIN
  -- Grant usage on net schema if it exists
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'net') THEN
    GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;
    
    -- Grant execute permissions on net.http_post function
    GRANT EXECUTE ON FUNCTION net.http_post TO postgres, anon, authenticated, service_role;
  END IF;
END $$;

-- Create a simple test function to verify the setup
CREATE OR REPLACE FUNCTION test_telegram_integration()
RETURNS text AS $$
BEGIN
  -- Check if pg_net extension is available
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
    RETURN 'pg_net extension is enabled and ready for Telegram notifications';
  ELSE
    RETURN 'pg_net extension is not enabled - Telegram notifications will not work';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add a comment to the function for documentation
COMMENT ON FUNCTION notify_telegram_on_new_order() IS 'Automatically sends Telegram notifications when new exchange orders are created';
COMMENT ON FUNCTION test_telegram_integration() IS 'Test function to verify Telegram integration setup';