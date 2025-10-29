const Houseboat = require("../models/houseboatModel");
const HouseboatBooking = require("../models/houseboatBookingModel");
const { validationResult } = require("express-validator");

// Get all houseboats with filtering and pagination
const getAllHouseboats = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      location,
      minPrice,
      maxPrice,
      capacity,
      isFeatured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };

    // Apply filters
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    if (capacity) query.capacity = { $gte: parseInt(capacity) };
    if (isFeatured === 'true') query.isFeatured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { amenities: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const houseboats = await Houseboat.find(query)
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Houseboat.countDocuments(query);

    res.status(200).json({
      success: true,
      data: houseboats,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching houseboats",
      error: error.message
    });
  }
};

// Get single houseboat by ID
const getHouseboatById = async (req, res) => {
  try {
    const houseboat = await Houseboat.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!houseboat) {
      return res.status(404).json({
        success: false,
        message: "Houseboat not found"
      });
    }

    res.status(200).json({
      success: true,
      data: houseboat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching houseboat",
      error: error.message
    });
  }
};

// Create new houseboat (Admin only)
const createHouseboat = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      });
    }

    const houseboatData = {
      ...req.body,
      createdBy: req.user.id
    };

    const newHouseboat = new Houseboat(houseboatData);
    await newHouseboat.save();

    res.status(201).json({
      success: true,
      message: "Houseboat created successfully",
      data: newHouseboat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating houseboat",
      error: error.message
    });
  }
};

// Update houseboat (Admin only)
const updateHouseboat = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      });
    }

    const houseboat = await Houseboat.findById(req.params.id);
    if (!houseboat) {
      return res.status(404).json({
        success: false,
        message: "Houseboat not found"
      });
    }

    const updatedHouseboat = await Houseboat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: "Houseboat updated successfully",
      data: updatedHouseboat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating houseboat",
      error: error.message
    });
  }
};

// Delete houseboat (Admin only)
const deleteHouseboat = async (req, res) => {
  try {
    const houseboat = await Houseboat.findById(req.params.id);
    if (!houseboat) {
      return res.status(404).json({
        success: false,
        message: "Houseboat not found"
      });
    }

    // Soft delete by setting isActive to false
    await Houseboat.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Houseboat deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting houseboat",
      error: error.message
    });
  }
};

// Get featured houseboats
const getFeaturedHouseboats = async (req, res) => {
  try {
    const houseboats = await Houseboat.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(6);

    res.status(200).json({
      success: true,
      data: houseboats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured houseboats",
      error: error.message
    });
  }
};

// Book houseboat
const bookHouseboat = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      });
    }

    const houseboat = await Houseboat.findById(req.body.houseboatId);
    if (!houseboat || !houseboat.isActive) {
      return res.status(404).json({
        success: false,
        message: "Houseboat not found or not available"
      });
    }

    const totalAmount = req.body.selectedItems.reduce((sum, item) => sum + item.price, 0);
    const advanceAmount = Math.round(totalAmount * 0.5);
    const remainingAmount = totalAmount - advanceAmount;

    const bookingData = {
      ...req.body,
      userId: req.user.id,
      houseboatTitle: houseboat.name,
      houseboatPrice: houseboat.price,
      totalAmount: totalAmount,
      advanceAmount: advanceAmount,
      remainingAmount: remainingAmount
    };

    const newBooking = new HouseboatBooking(bookingData);
    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Houseboat booked successfully",
      data: newBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error booking houseboat",
      error: error.message
    });
  }
};

// Initialize payment for houseboat booking
const initializeHouseboatPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      });
    }

    const houseboat = await Houseboat.findById(req.body.houseboatId);
    if (!houseboat || !houseboat.isActive) {
      return res.status(404).json({
        success: false,
        message: "Houseboat not found or not available"
      });
    }

    // Import SSLCommerz configuration and dependencies
    const { v4: uuidv4 } = require("uuid");
    const axios = require('axios');

    // SSLCommerz configuration
    const SSLCOMMERZ_CONFIG = {
      store_id: 'docto62cd49c8d7c9c',
      store_passwd: 'docto62cd49c8d7c9c@ssl',
      isSandbox: true,
      api_url: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
    };

    const totalAmount = req.body.totalAmount;
    const advanceAmount = req.body.advanceAmount || Math.round(totalAmount * 0.5);
    const transactionId = uuidv4();

    // SSLCommerz payment data
    const paymentData = new URLSearchParams({
      store_id: SSLCOMMERZ_CONFIG.store_id,
      store_passwd: SSLCOMMERZ_CONFIG.store_passwd,
      total_amount: advanceAmount, // Pay only the advance amount
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/success`,
      fail_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/fail`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/cancel`,
      ipn_url: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/houseboats/payment/ipn`,
      shipping_method: 'NO',
      product_name: `Houseboat Booking - ${houseboat.name}`,
      product_category: 'Accommodation',
      product_profile: 'general',
      cus_name: req.user.name,
      cus_email: req.user.email,
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: req.user.phone || '01700000000',
      cus_fax: '01700000000',
      ship_name: req.user.name,
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: '1000',
      ship_country: 'Bangladesh',
      multi_card_name: 'mastercard,visacard,amexcard',
      value_a: req.body.houseboatId,
      value_b: JSON.stringify(req.body.selectedItems),
      value_c: req.user.id,
      value_d: req.body.checkInDate,
      value_e: JSON.stringify({
        bookingReference: req.body.bookingReference,
        totalAmount: totalAmount,
        advanceAmount: advanceAmount,
        remainingAmount: totalAmount - advanceAmount,
        paymentType: 'advance'
      })
    });

    // Initialize payment using direct API call
    console.log('Houseboat payment data being sent:', paymentData);
    
    const response = await axios.post(SSLCOMMERZ_CONFIG.api_url, paymentData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('SSLCommerz response for houseboat:', response.data);
    
    if (response.data.status === 'SUCCESS') {
      // Store payment session data temporarily
      global.paymentSessions = global.paymentSessions || {};
      global.paymentSessions[transactionId] = {
        houseboatId: req.body.houseboatId,
        bookingReference: req.body.bookingReference,
        selectedItems: req.body.selectedItems,
        checkInDate: req.body.checkInDate,
        checkOutDate: req.body.checkOutDate,
        guestCount: req.body.guestCount,
        guestDetails: req.body.guestDetails,
        emergencyContact: req.body.emergencyContact,
        specialRequests: req.body.specialRequests,
        userId: req.user.id,
        totalAmount: totalAmount,
        advanceAmount: advanceAmount,
        remainingAmount: totalAmount - advanceAmount,
        paymentType: 'advance',
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
    console.error('Houseboat payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get user's houseboat bookings
const getUserHouseboatBookings = async (req, res) => {
  try {
    const bookings = await HouseboatBooking.find({ userId: req.user.id })
      .populate('houseboat', 'name images location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message
    });
  }
};

// Get all houseboat bookings (Admin only)
const getAllHouseboatBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      search
    } = req.query;

    const query = {};
    if (status) query.bookingStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { houseboatTitle: { $regex: search, $options: 'i' } },
        { bookingReference: { $regex: search, $options: 'i' } },
        { 'guestDetails.name': { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await HouseboatBooking.find(query)
      .populate('houseboat', 'name images location')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await HouseboatBooking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message
    });
  }
};

// Update booking status (Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus, notes } = req.body;

    const booking = await HouseboatBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    const updateData = {};
    if (status) updateData.bookingStatus = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes) updateData.notes = notes;

    const updatedBooking = await HouseboatBooking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('houseboat', 'name images location')
     .populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: updatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating booking status",
      error: error.message
    });
  }
};

// Houseboat payment IPN handler
const houseboatPaymentIPN = async (req, res) => {
  try {
    const { tran_id, val_id, amount, card_type, store_amount, card_no, bank_tran_id, status, tran_date, currency, card_issuer, card_brand, card_issuer_country, card_issuer_country_code, store_id, verify_sign, verify_key, cus_fax, currency_type, currency_amount, currency_rate, base_fair, value_a, value_b, value_c, value_d, value_e, risk_level, risk_title } = req.body;

    // For now, we'll trust the SSLCommerz IPN
    // In production, you should verify the IPN with SSLCommerz API
    if (status === 'VALID') {
      // Update houseboat booking status if needed
      const houseboatBooking = await HouseboatBooking.findOne({ advanceTransactionId: tran_id });
      if (houseboatBooking && status === 'VALID') {
        houseboatBooking.paymentStatus = 'advance_paid';
        await houseboatBooking.save();
      }

      res.json({
        success: true,
        message: "Houseboat payment IPN processed successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Houseboat payment IPN verification failed"
      });
    }
  } catch (error) {
    console.error('Houseboat payment IPN error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getAllHouseboats,
  getHouseboatById,
  createHouseboat,
  updateHouseboat,
  deleteHouseboat,
  getFeaturedHouseboats,
  bookHouseboat,
  initializeHouseboatPayment,
  houseboatPaymentIPN,
  getUserHouseboatBookings,
  getAllHouseboatBookings,
  updateBookingStatus
};







