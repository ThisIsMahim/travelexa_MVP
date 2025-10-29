// server/Controllers/paymentController.js
require("dotenv").config();
const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");
const User = require("../models/usersModel");
const { v4: uuidv4 } = require("uuid");
const axios = require('axios');

// SSLCommerz configuration - Hardcoded for immediate fix
const SSLCOMMERZ_CONFIG = {
  store_id: 'docto62cd49c8d7c9c',
  store_passwd: 'docto62cd49c8d7c9c@ssl',
  isSandbox: true,
  api_url: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
};

// Initialize payment
const initializePayment = async (req, res) => {
  try {
    console.log('Payment request body:', req.body);
    const { busId, seats, userId, paymentOption = 'full', totalAmount, paymentAmount, packageId, guestCount, travelDate, returnDate, guestDetails, emergencyContact, specialRequests, packageTitle, packagePrice, bookingReference } = req.body;
    
    console.log('Extracted values:', { busId, seats, userId, paymentOption, totalAmount, paymentAmount });
    
    let user, productName, productCategory, bus;
    
    // Check if this is a package booking or bus booking
    if (packageId) {
      // Package booking
      const Package = require("../models/packagesModel");
      const packageData = await Package.findById(packageId);
      user = await User.findById(userId);
      
      if (!packageData || !user) {
        return res.status(404).json({
          success: false,
          message: "Package or user not found"
        });
      }
      
      productName = `Package Booking - ${packageTitle} (${paymentOption === 'advance' ? '50% Advance' : 'Full Payment'})`;
      productCategory = 'Travel Package';
    } else {
      // Bus booking
      bus = await Bus.findById(busId);
      user = await User.findById(userId);
    
      if (!bus || !user) {
        return res.status(404).json({
          success: false,
          message: "Bus or user not found"
        });
      }

      productName = `Bus Booking - ${bus.name} (${paymentOption === 'advance' ? '50% Advance' : 'Full Payment'})`;
      productCategory = 'Transportation';
    }

    const calculatedTotalAmount = packageId ? (packagePrice * guestCount) : (bus.price * seats.length);
    const finalTotalAmount = totalAmount || calculatedTotalAmount;
    const finalPaymentAmount = paymentAmount || (paymentOption === 'advance' ? finalTotalAmount * 0.5 : finalTotalAmount);
    const transactionId = uuidv4();

    // SSLCommerz payment data - must be form-encoded
    const paymentData = new URLSearchParams({
      store_id: SSLCOMMERZ_CONFIG.store_id,
      store_passwd: SSLCOMMERZ_CONFIG.store_passwd,
      total_amount: finalPaymentAmount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/success`,
      fail_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/fail`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/cancel`,
      ipn_url: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/bookings/payment/ipn`,
      shipping_method: 'NO',
      product_name: productName,
      product_category: productCategory,
      product_profile: 'general',
      cus_name: user.name,
      cus_email: user.email,
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: user.phone || '01700000000',
      cus_fax: '01700000000',
      ship_name: user.name,
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: '1000',
      ship_country: 'Bangladesh',
      multi_card_name: 'mastercard,visacard,amexcard',
      value_a: packageId || busId,
      value_b: packageId ? JSON.stringify({ guestCount, travelDate, returnDate, guestDetails, emergencyContact, specialRequests, packageTitle, packagePrice, bookingReference }) : JSON.stringify(seats),
      value_c: userId,
      value_d: packageId ? travelDate : bus.journeyDate,
      value_e: paymentOption,
      value_f: finalTotalAmount.toString(),
      value_g: finalPaymentAmount.toString()
    });

    // Initialize payment using direct API call
    console.log('Payment data being sent:', paymentData);
    
    const response = await axios.post(SSLCOMMERZ_CONFIG.api_url, paymentData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('SSLCommerz response:', response.data);
    
    if (response.data.status === 'SUCCESS') {
      // Store payment session data temporarily
      // In production, you might want to store this in Redis or database
      global.paymentSessions = global.paymentSessions || {};
      global.paymentSessions[transactionId] = {
        busId,
        seats,
        userId,
        packageId,
        guestCount,
        travelDate,
        returnDate,
        guestDetails,
        emergencyContact,
        specialRequests,
        packageTitle,
        packagePrice,
        bookingReference,
        totalAmount: finalTotalAmount,
        paymentAmount: finalPaymentAmount,
        paymentOption: paymentOption,
        status: 'pending'
      };

      res.json({
        success: true,
        data: {
          gatewayPageURL: response.data.GatewayPageURL,
          transactionId: transactionId
        },
        message: "Payment initialized successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to initialize payment"
      });
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Payment success handler
const paymentSuccess = async (req, res) => {
  try {
    const { tran_id, val_id, amount, card_type, store_amount, card_no, bank_tran_id, status, tran_date, currency, card_issuer, card_brand, card_issuer_country, card_issuer_country_code, store_id, verify_sign, verify_key, cus_fax, currency_type, currency_amount, currency_rate, base_fair, value_a, value_b, value_c, value_d, value_e, value_f, value_g, risk_level, risk_title } = req.body;

    // For now, we'll trust the SSLCommerz callback
    // In production, you should verify the payment with SSLCommerz API
    if (status === 'VALID') {
      // Get payment session data
      const sessionData = global.paymentSessions?.[tran_id];
      
      if (sessionData) {
        // Check if this is a houseboat, package, or bus booking
        if (sessionData.houseboatId) {
          // Houseboat booking
          const HouseboatBooking = require("../models/houseboatBookingModel");
          const Houseboat = require("../models/houseboatModel");
          
          // Get houseboat details
          const houseboat = await Houseboat.findById(sessionData.houseboatId);
          
          const bookingData = {
            houseboat: sessionData.houseboatId,
            bookingReference: sessionData.bookingReference,
            selectedItems: sessionData.selectedItems,
            checkInDate: sessionData.checkInDate,
            checkOutDate: sessionData.checkOutDate,
            guestCount: sessionData.guestCount,
            guestDetails: sessionData.guestDetails,
            emergencyContact: sessionData.emergencyContact,
            specialRequests: sessionData.specialRequests,
            userId: sessionData.userId,
            houseboatTitle: houseboat.name,
            houseboatPrice: houseboat.price,
            totalAmount: sessionData.totalAmount,
            advanceAmount: sessionData.advanceAmount,
            remainingAmount: sessionData.remainingAmount,
            paymentStatus: 'advance_paid',
            paymentMethod: card_type || 'SSLCommerz',
            transactionId: tran_id,
            advanceTransactionId: tran_id
          };

          const newHouseboatBooking = new HouseboatBooking(bookingData);
          await newHouseboatBooking.save();

          // Clean up session data
          delete global.paymentSessions[tran_id];

          res.json({
            success: true,
            message: "Houseboat booking confirmed with advance payment",
            data: {
              bookingId: newHouseboatBooking._id,
              transactionId: tran_id,
              advanceAmount: sessionData.advanceAmount,
              remainingAmount: sessionData.remainingAmount,
              bookingReference: sessionData.bookingReference
            }
          });
        } else if (sessionData.packageId) {
          // Package booking
          const PackageOrder = require("../models/packageOrdersModel");
          const Package = require("../models/packagesModel");
          
          // Get package details
          const package = await Package.findById(sessionData.packageId);
          
          const bookingStatus = sessionData.paymentOption === 'advance' ? 'Booked' : 'Confirmed';
          const paymentStatus = sessionData.paymentOption === 'advance' ? 'Advance_Paid' : 'Paid';
          
          const bookingData = {
            packageId: sessionData.packageId,
            bookingReference: sessionData.bookingReference,
            guestCount: sessionData.guestCount,
            travelDate: sessionData.travelDate,
            returnDate: sessionData.returnDate,
            guestDetails: sessionData.guestDetails,
            emergencyContact: sessionData.emergencyContact,
            specialRequests: sessionData.specialRequests,
            userId: sessionData.userId,
            packageTitle: sessionData.packageTitle,
            packagePrice: sessionData.packagePrice,
            totalAmount: sessionData.totalAmount,
            advanceAmount: sessionData.paymentOption === 'advance' ? sessionData.paymentAmount : 0,
            remainingAmount: sessionData.paymentOption === 'advance' ? (sessionData.totalAmount - sessionData.paymentAmount) : 0,
            bookingStatus: bookingStatus,
            paymentStatus: paymentStatus,
            paymentMethod: card_type || 'SSLCommerz',
            transactionId: tran_id,
            advanceTransactionId: sessionData.paymentOption === 'advance' ? tran_id : null,
            finalTransactionId: sessionData.paymentOption === 'full' ? tran_id : null
          };

          const newPackageBooking = new PackageOrder(bookingData);
          await newPackageBooking.save();

          // Clean up session data
          delete global.paymentSessions[tran_id];

          res.json({
            success: true,
            message: `Package booking ${bookingStatus.toLowerCase()} with ${sessionData.paymentOption === 'advance' ? 'advance' : 'full'} payment`,
            data: {
              bookingId: newPackageBooking._id,
              transactionId: tran_id,
              amount: sessionData.paymentAmount,
              totalAmount: sessionData.totalAmount,
              bookingStatus: bookingStatus,
              paymentStatus: paymentStatus,
              bookingReference: sessionData.bookingReference
            }
          });
        } else {
          // Bus booking (existing logic)
          const bookingStatus = sessionData.paymentOption === 'advance' ? 'Booked' : 'Confirmed';
          const paymentStatus = sessionData.paymentOption === 'advance' ? 'Advance_Paid' : 'Paid';
          
        const newBooking = new Booking({
          bus: sessionData.busId,
          user: sessionData.userId,
          seats: sessionData.seats,
          transactionId: tran_id,
            amount: sessionData.totalAmount,
            paymentAmount: sessionData.paymentAmount,
            paymentStatus: paymentStatus,
            bookingStatus: bookingStatus,
            paymentMethod: card_type || 'SSLCommerz',
            advanceAmount: sessionData.paymentOption === 'advance' ? sessionData.paymentAmount : 0,
            remainingAmount: sessionData.paymentOption === 'advance' ? (sessionData.totalAmount - sessionData.paymentAmount) : 0,
            advanceTransactionId: sessionData.paymentOption === 'advance' ? tran_id : null,
            finalTransactionId: sessionData.paymentOption === 'full' ? tran_id : null
        });

        await newBooking.save();

        // Update bus seats
        const bus = await Bus.findById(sessionData.busId);
        bus.seatsBooked = [...bus.seatsBooked, ...sessionData.seats];
        await bus.save();

        // Clean up session data
        delete global.paymentSessions[tran_id];

        res.json({
          success: true,
            message: `Payment successful and booking ${bookingStatus.toLowerCase()}`,
          data: {
            bookingId: newBooking._id,
            transactionId: tran_id,
              amount: sessionData.paymentAmount,
              totalAmount: sessionData.totalAmount,
              bookingStatus: bookingStatus,
              paymentStatus: paymentStatus
          }
        });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid payment session"
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }
  } catch (error) {
    console.error('Payment success error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Payment fail handler
const paymentFail = async (req, res) => {
  try {
    const { tran_id, error } = req.body;
    
    // Clean up session data
    if (global.paymentSessions?.[tran_id]) {
      delete global.paymentSessions[tran_id];
    }

    res.json({
      success: false,
      message: "Payment failed",
      error: error || "Payment was not successful"
    });
  } catch (error) {
    console.error('Payment fail error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Payment cancel handler
const paymentCancel = async (req, res) => {
  try {
    const { tran_id } = req.body;
    
    // Clean up session data
    if (global.paymentSessions?.[tran_id]) {
      delete global.paymentSessions[tran_id];
    }

    res.json({
      success: false,
      message: "Payment cancelled by user"
    });
  } catch (error) {
    console.error('Payment cancel error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// IPN (Instant Payment Notification) handler
const paymentIPN = async (req, res) => {
  try {
    const { tran_id, val_id, amount, card_type, store_amount, card_no, bank_tran_id, status, tran_date, currency, card_issuer, card_brand, card_issuer_country, card_issuer_country_code, store_id, verify_sign, verify_key, cus_fax, currency_type, currency_amount, currency_rate, base_fair, value_a, value_b, value_c, value_d, risk_level, risk_title } = req.body;

    // For now, we'll trust the SSLCommerz IPN
    // In production, you should verify the IPN with SSLCommerz API
    if (status === 'VALID') {
      // Update booking status if needed
      const booking = await Booking.findOne({ transactionId: tran_id });
      if (booking && status === 'VALID') {
        booking.paymentStatus = 'completed';
        await booking.save();
      }

      res.json({
        success: true,
        message: "IPN processed successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "IPN verification failed"
      });
    }
  } catch (error) {
    console.error('IPN error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  initializePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN
};