import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TelegramMessage {
  chat_id: string
  text: string
  parse_mode?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Telegram bot token from environment variables
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID') // Your chat ID where notifications will be sent

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram bot token or chat ID not configured')
    }

    // Parse the request body
    const { record } = await req.json()

    if (!record) {
      throw new Error('No record data provided')
    }

    // Format the message for Telegram
    const message = `
🔄 *Новая заявка на обмен*

📋 *ID заказа:* \`${record.id}\`
📧 *Email:* ${record.email}
💰 *Отправляет:* ${record.send_amount} ${record.send_currency_symbol} (${record.send_currency_name})
💎 *Получает:* ${record.receive_amount} ${record.receive_currency_symbol} (${record.receive_currency_name})
🏷️ *Тип заказа:* ${record.order_type}
📍 *Адрес получателя:* \`${record.recipient_address}\`
${record.promo_code ? `🎫 *Промо-код:* ${record.promo_code}` : ''}
📊 *Статус:* ${record.status}
⏰ *Создан:* ${new Date(record.created_at).toLocaleString('ru-RU')}

---
💼 *TrueNorth Exchange*
    `.trim()

    // Send message to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        } as TelegramMessage),
      }
    )

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text()
      throw new Error(`Telegram API error: ${errorText}`)
    }

    const telegramResult = await telegramResponse.json()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification sent to Telegram successfully',
        telegram_response: telegramResult,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending Telegram notification:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})