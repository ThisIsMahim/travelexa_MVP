import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { message } from "antd";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        // Get payment data from URL parameters
        const paymentParams = {
          tran_id: searchParams.get('tran_id'),
          val_id: searchParams.get('val_id'),
          amount: searchParams.get('amount'),
          card_type: searchParams.get('card_type'),
          store_amount: searchParams.get('store_amount'),
          card_no: searchParams.get('card_no'),
          bank_tran_id: searchParams.get('bank_tran_id'),
          status: searchParams.get('status'),
          tran_date: searchParams.get('tran_date'),
          currency: searchParams.get('currency'),
          card_issuer: searchParams.get('card_issuer'),
          card_brand: searchParams.get('card_brand'),
          card_issuer_country: searchParams.get('card_issuer_country'),
          card_issuer_country_code: searchParams.get('card_issuer_country_code'),
          store_id: searchParams.get('store_id'),
          verify_sign: searchParams.get('verify_sign'),
          verify_key: searchParams.get('verify_key'),
          cus_fax: searchParams.get('cus_fax'),
          currency_type: searchParams.get('currency_type'),
          currency_amount: searchParams.get('currency_amount'),
          currency_rate: searchParams.get('currency_rate'),
          base_fair: searchParams.get('base_fair'),
          value_a: searchParams.get('value_a'),
          value_b: searchParams.get('value_b'),
          value_c: searchParams.get('value_c'),
          value_d: searchParams.get('value_d'),
          risk_level: searchParams.get('risk_level'),
          risk_title: searchParams.get('risk_title')
        };

        setPaymentData(paymentParams);

        // Send payment data to backend for verification
        const response = await fetch('/api/payment/success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentParams),
        });

        const result = await response.json();

        if (result.success) {
          message.success("Payment successful! Your booking has been confirmed.");
          setLoading(false);
        } else {
          message.error("Payment verification failed. Please contact support.");
          setLoading(false);
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        message.error("An error occurred while processing your payment.");
        setLoading(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams]);

  const handleGoToBookings = () => {
    navigate('/bookings');
  };

  const handleGoHome = () => {
    navigate('/easy-booking');
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Processing Payment...</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Processing your payment...</h2>
            <p className="text-gray-500 mt-2">Please wait while we confirm your booking.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Successful</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your booking has been confirmed. You will receive a confirmation email shortly.
          </p>

          {/* Payment Details */}
          {paymentData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Details:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{paymentData.tran_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">{paymentData.amount} {paymentData.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{paymentData.card_type || 'SSLCommerz'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(paymentData.tran_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoToBookings}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              View My Bookings
            </button>
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Book Another Trip
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;
