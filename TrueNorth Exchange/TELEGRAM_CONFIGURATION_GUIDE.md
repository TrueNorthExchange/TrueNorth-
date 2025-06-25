# 🚀 Telegram Bot Configuration Guide

## Your Bot Details
- **Bot Token**: `7065862807:AAEYyovgy5dVRlqERgMy4uO1GnABkdlIZH0`
- **Chat ID**: `-4989074575`

## ⚙️ Step-by-Step Configuration

### 1. Configure Environment Variables in Supabase Dashboard

1. Open your **Supabase Dashboard**
2. Go to **Settings** → **Edge Functions**
3. In the **Secrets** section, add these two environment variables:

```
TELEGRAM_BOT_TOKEN=7065862807:AAEYyovgy5dVRlqERgMy4uO1GnABkdlIZH0
TELEGRAM_CHAT_ID=-4989074575
```

### 2. Verify Configuration

After adding the environment variables:
1. Wait 1-2 minutes for the changes to propagate
2. Create a test exchange order on your website
3. Check your Telegram chat for the notification

### 3. Test the Bot Manually (Optional)

You can test if your bot is working by sending a test message:

```bash
curl -X POST "https://api.telegram.org/bot7065862807:AAEYyovgy5dVRlqERgMy4uO1GnABkdlIZH0/sendMessage" \
     -H "Content-Type: application/json" \
     -d '{"chat_id": "-4989074575", "text": "🤖 Test message from TrueNorth Exchange Bot"}'
```

## 🔧 Troubleshooting

If notifications still don't work after configuration:

1. **Check Edge Function Logs**:
   - Go to Supabase Dashboard → Edge Functions → Logs
   - Look for any error messages

2. **Verify Bot Permissions**:
   - Make sure the bot is added to the chat/group
   - Ensure the bot has permission to send messages

3. **Check Environment Variables**:
   - Verify the variables are correctly set in Supabase
   - Make sure there are no extra spaces or characters

## 📱 Expected Notification Format

Once configured, you'll receive notifications like this:

```
🔄 Новая заявка на обмен

📋 ID заказа: abc123-def456-ghi789
📧 Email: user@example.com
💰 Отправляет: 1.0 BTC (Bitcoin)
💎 Получает: 43250.00 USDT (Tether)
🏷️ Тип заказа: Floating
📍 Адрес получателя: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
📊 Статус: pending
⏰ Создан: 24.06.2025, 15:30:45

---
💼 TrueNorth Exchange
```

## ✅ Next Steps

1. **Configure the environment variables** in your Supabase Dashboard as described above
2. **Test the integration** by creating a sample exchange order
3. **Monitor the logs** to ensure everything is working correctly

The error will be resolved once you add these environment variables to your Supabase project settings.