import React, { useState } from 'react';
import { ArrowLeft, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendTelegramNotification } from '../lib/telegram';
import { CryptoCurrency } from '../lib/coingecko';

interface OrderDetailsPageProps {
  sendCurrency: CryptoCurrency;
  receiveCurrency: CryptoCurrency;
  sendAmount: string;
  receiveAmount: string;
  orderType: string;
  onBack: () => void;
}

export default function OrderDetailsPage({
  sendCurrency,
  receiveCurrency,
  sendAmount,
  receiveAmount,
  orderType,
  onBack
}: OrderDetailsPageProps) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleConfirmExchange = async () => {
    // Validate required fields
    if (!recipientAddress.trim()) {
      setSubmitError('Recipient address is required');
      return;
    }
    if (!email.trim()) {
      setSubmitError('Email address is required');
      return;
    }
    if (!email.includes('@')) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Insert exchange order into Supabase
      const { data, error } = await supabase
        .from('exchange_orders')
        .insert([
          {
            send_currency_symbol: sendCurrency.symbol,
            send_currency_name: sendCurrency.name,
            send_amount: sendAmount,
            receive_currency_symbol: receiveCurrency.symbol,
            receive_currency_name: receiveCurrency.name,
            receive_amount: receiveAmount,
            order_type: orderType,
            recipient_address: recipientAddress.trim(),
            email: email.trim(),
            promo_code: promoCode.trim() || null,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Handle successful submission
      console.log('Exchange order created successfully:', data);
      setOrderId(data.id);

      // Send Telegram notification
      try {
        const telegramSuccess = await sendTelegramNotification({
          orderId: data.id,
          email: email.trim(),
          sendAmount: sendAmount,
          sendCurrency: `${sendCurrency.symbol} ${sendCurrency.name}`,
          receiveAmount: receiveAmount,
          receiveCurrency: `${receiveCurrency.symbol} ${receiveCurrency.name}`,
          recipientAddress: recipientAddress.trim(),
          orderType: orderType,
          promoCode: promoCode.trim() || undefined
        });

        if (telegramSuccess) {
          console.log('Telegram notification sent successfully');
        } else {
          console.warn('Failed to send Telegram notification, but order was created');
        }
      } catch (telegramError) {
        console.error('Telegram notification error:', telegramError);
        // Don't fail the entire process if Telegram fails
      }

      setSubmitSuccess(true);
      
      // Reset form
      setRecipientAddress('');
      setEmail('');
      setPromoCode('');
      
    } catch (error) {
      console.error('Error creating exchange order:', error);
      setSubmitError('Failed to create exchange order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="mb-6">
                <div className="bg-green-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h1 className="text-3xl font-bold text-green-400 mb-2">Order Created Successfully!</h1>
                <p className="text-gray-300">Your exchange order has been submitted and is being processed.</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-600">
                <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order ID:</span>
                    <span className="font-mono text-purple-400">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Exchange:</span>
                    <span>{sendAmount} {sendCurrency.symbol} → {receiveAmount} {receiveCurrency.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-yellow-400">Pending</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-300">
                <p>
                  📧 <strong>Check your email</strong> for detailed payment instructions and order tracking information.
                </p>
                <p>
                  ⏱️ Your order will be processed within <strong>15-30 minutes</strong> after payment confirmation.
                </p>
                <p>
                  🔒 Your funds are secured by our advanced AML compliance system.
                </p>
                <p>
                  📱 <strong>Our team has been notified</strong> and will process your order shortly.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  onClick={onBack}
                  className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Create Another Exchange
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Calculator</span>
          </button>
          <h1 className="text-4xl font-bold">Order Details</h1>
          <p className="text-gray-400 mt-2">Complete your exchange by providing the required information</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Exchange Summary */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Exchange Summary</h2>
              
              {/* You Send */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-300">You Send</h3>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center space-x-4">
                    {sendCurrency.image ? (
                      <img src={sendCurrency.image} alt={sendCurrency.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <div className={`w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold ${sendCurrency.color}`}>
                        {sendCurrency.icon}
                      </div>
                    )}
                    <div>
                      <div className="text-2xl font-bold">{sendAmount} {sendCurrency.symbol}</div>
                      <div className="text-gray-400">{sendCurrency.name}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* You Get */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-300">You Get (Approximate)</h3>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center space-x-4">
                    {receiveCurrency.image ? (
                      <img src={receiveCurrency.image} alt={receiveCurrency.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <div className={`w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold ${receiveCurrency.color}`}>
                        {receiveCurrency.icon}
                      </div>
                    )}
                    <div>
                      <div className="text-2xl font-bold">{receiveAmount} {receiveCurrency.symbol}</div>
                      <div className="text-gray-400">{receiveCurrency.name}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Type */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-300">Order Type</h3>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-600">
                  <div className="text-lg font-semibold">{orderType}</div>
                </div>
              </div>

              {/* AML Notice */}
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4 flex items-start space-x-3">
                <Shield className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-1">AML Compliance</h4>
                  <p className="text-sm text-yellow-200">
                    Our exchanges conduct automatic AML checks on all incoming transactions using specialized services.
                  </p>
                </div>
              </div>
            </div>

            {/* User Details Form */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Your Details</h2>
              
              <div className="space-y-6">
                {/* Recipient Address - DYNAMIC FIELD */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">
                    Enter your {receiveCurrency.symbol} address *
                  </label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder={`Enter your ${receiveCurrency.symbol} wallet address`}
                    className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Make sure this address supports {receiveCurrency.name} ({receiveCurrency.symbol}) tokens
                  </p>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">
                    Enter your Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    We'll send exchange updates and instructions to this email
                  </p>
                </div>

                {/* Promo Code */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">
                    Promo code (Optional)
                  </label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code if you have one"
                    className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-200">{submitError}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4 pt-4">
                  <button
                    onClick={handleConfirmExchange}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Exchange'}
                  </button>
                  
                  <button
                    onClick={onBack}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl text-lg font-semibold transition-colors"
                  >
                    Back to Calculator
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Important Information</h3>
            <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
              <p>
                • After confirming your exchange, you will receive detailed payment instructions via email.
              </p>
              <p>
                • The exchange will be processed once we receive your payment and the required network confirmations.
              </p>
              <p>
                • Exchange rates are locked for 15 minutes after order creation for fixed-rate orders.
              </p>
              <p>
                • For floating-rate orders, the final rate will be determined at the time of processing.
              </p>
              <p>
                • Processing time typically ranges from 5-30 minutes depending on network conditions.
              </p>
              <p>
                • Our team will be automatically notified of your order and will begin processing immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}