import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { message } from "antd";

function PaymentCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const processPaymentCancel = async () => {
      try {
        const paymentParams = {
          tran_id: searchParams.get('tran_id')
        };

        // Send payment cancel data to backend
        await fetch('/api/payment/cancel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentParams),
        });

        message.warning("Payment was cancelled. Redirecting to home page...");
        
        // Start countdown
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              navigate('/easy-booking');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        console.error('Payment cancel processing error:', error);
        message.error("An error occurred while processing your payment.");
        
        // Still redirect even if there's an error
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              navigate('/easy-booking');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    };

    processPaymentCancel();
  }, [searchParams, navigate]);

  const handleTryAgain = () => {
    navigate('/easy-booking');
  };

  const handleGoHome = () => {
    navigate('/easy-booking');
  };

  return (
    <>
      <Helmet>
        <title>Payment Cancelled</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Cancel Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>

          {/* Cancel Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
          <p className="text-gray-600 mb-4">
            You have cancelled the payment process. No charges have been made to your account.
          </p>
          
          {/* Countdown Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">
              Redirecting to home page in <span className="font-bold text-lg">{countdown}</span> seconds...
            </p>
          </div>

          {/* Transaction Details */}
          {searchParams.get('tran_id') && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Transaction Details:</h3>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{searchParams.get('tran_id')}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-yellow-600">Cancelled</span>
                </div>
              </div>
            </div>
          )}

          {/* Info Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What happened?</h3>
            <p className="text-sm text-blue-700">
              You chose to cancel the payment during the SSLCommerz payment process. 
              Your booking has not been confirmed and no money has been charged.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleTryAgain}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again (Skip Countdown)
            </button>
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Go Back Home Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentCancel;
