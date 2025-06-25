// Telegram notification utility functions
import { supabase } from './supabase';

export interface TelegramNotificationData {
  orderId: string;
  email: string;
  sendAmount: string;
  sendCurrency: string;
  receiveAmount: string;
  receiveCurrency: string;
  recipientAddress: string;
  orderType: string;
  promoCode?: string;
}

/**
 * Send notification to Telegram bot via Supabase Edge Function
 */
export async function sendTelegramNotification(data: TelegramNotificationData): Promise<boolean> {
  try {
    const { data: result, error } = await supabase.functions.invoke('telegram-notifications', {
      body: {
        record: {
          id: data.orderId,
          email: data.email,
          send_amount: data.sendAmount,
          send_currency_symbol: data.sendCurrency.split(' ')[0], // Extract symbol
          send_currency_name: data.sendCurrency,
          receive_amount: data.receiveAmount,
          receive_currency_symbol: data.receiveCurrency.split(' ')[0], // Extract symbol
          receive_currency_name: data.receiveCurrency,
          recipient_address: data.recipientAddress,
          order_type: data.orderType,
          promo_code: data.promoCode,
          status: 'pending',
          created_at: new Date().toISOString(),
        }
      }
    });

    if (error) {
      console.error('Error calling Telegram notification function:', error);
      return false;
    }

    console.log('Telegram notification sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}

/**
 * Test Telegram bot connection
 */
export async function testTelegramConnection(): Promise<boolean> {
  try {
    const testData: TelegramNotificationData = {
      orderId: 'test-' + Date.now(),
      email: 'test@example.com',
      sendAmount: '1.0',
      sendCurrency: 'BTC Bitcoin',
      receiveAmount: '2680.50',
      receiveCurrency: 'ETH Ethereum',
      recipientAddress: '0x1234567890abcdef1234567890abcdef12345678',
      orderType: 'Floating',
      promoCode: 'TEST'
    };

    return await sendTelegramNotification(testData);
  } catch (error) {
    console.error('Telegram connection test failed:', error);
    return false;
  }
}