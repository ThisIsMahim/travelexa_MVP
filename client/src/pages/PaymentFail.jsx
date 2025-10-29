import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { message } from "antd";

function PaymentFail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const processPaymentFail = async () => {
      try {
        const paymentParams = {
          tran_id: searchParams.get('tran_id'),
          error: searchParams.get('error')
        };

        // Send payment fail data to backend
        await fetch('/api/payment/fail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentParams),
        });

        message.error("Payment failed. Redirecting to home page...");
        
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
        console.error('Payment fail processing error:', error);
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

    processPaymentFail();
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
        <title>Payment Failed</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Fail Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>

          {/* Fail Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-4">
            Unfortunately, your payment could not be processed. This could be due to insufficient funds, 
            incorrect card details, or network issues.
          </p>
          
          {/* Countdown Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">
              Redirecting to home page in <span className="font-bold text-lg">{countdown}</span> seconds...
            </p>
          </div>

          {/* Error Details */}
          {searchParams.get('error') && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-red-900 mb-2">Error Details:</h3>
              <p className="text-sm text-red-700">{searchParams.get('error')}</p>
            </div>
          )}

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What you can do:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check your card details and try again</li>
              <li>• Ensure you have sufficient funds</li>
              <li>• Try a different payment method</li>
              <li>• Contact your bank if the issue persists</li>
            </ul>
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

export default PaymentFail;
