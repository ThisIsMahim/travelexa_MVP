const Package = require("../models/packagesModel");
const PackageOrder = require("../models/packageOrdersModel");
const { validationResult } = require("express-validator");

// Get all packages with filtering and pagination
const getAllPackages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      destination,
      minPrice,
      maxPrice,
      difficulty,
      isFeatured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };

    // Apply filters
    if (category) query.category = category;
    if (destination) query.destination = { $regex: destination, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    if (difficulty) query.difficulty = difficulty;
    if (isFeatured === 'true') query.isFeatured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { highlights: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const packages = await Package.find(query)
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Package.countDocuments(query);

    res.status(200).json({
      success: true,
      data: packages,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching packages",
      error: error.message
    });
  }
};

// Get single package by ID
const getPackageById = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching package",
      error: error.message
    });
  }
};

// Create new package (Admin only)
const createPackage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      });
    }

    const packageData = {
      ...req.body,
      createdBy: req.user.id
    };

    const newPackage = new Package(packageData);
    await newPackage.save();

    res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: newPackage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating package",
      error: error.message
    });
  }
};

// Update package (Admin only)
const updatePackage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      });
    }

    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: updatedPackage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating package",
      error: error.message
    });
  }
};

// Delete package (Admin only)
const deletePackage = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    // Soft delete by setting isActive to false
    await Package.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Package deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting package",
      error: error.message
    });
  }
};

// Get featured packages
const getFeaturedPackages = async (req, res) => {
  try {
    const packages = await Package.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(6);

    res.status(200).json({
      success: true,
      data: packages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured packages",
      error: error.message
    });
  }
};

// Get package categories
const getPackageCategories = async (req, res) => {
  try {
    const categories = await Package.distinct('category', { isActive: true });
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message
    });
  }
};

// Book package
const bookPackage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      });
    }

    const package = await Package.findById(req.body.packageId);
    if (!package || !package.isActive) {
      return res.status(404).json({
        success: false,
        message: "Package not found or not available"
      });
    }

    if (req.body.guestCount > package.maxGuests) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${package.maxGuests} guests allowed for this package`
      });
    }

    if (req.body.guestCount < package.minGuests) {
      return res.status(400).json({
        success: false,
        message: `Minimum ${package.minGuests} guests required for this package`
      });
    }

    const totalAmount = package.price * req.body.guestCount;
    const paymentOption = req.body.paymentOption || 'full';
    const paymentAmount = req.body.paymentAmount || totalAmount;

    // If payment option is advance, redirect to payment gateway
    if (paymentOption === 'advance' || paymentOption === 'full') {
      // Initialize SSL payment
      const { initializePayment } = require('./paymentController');
      
      // Create a mock request object for payment initialization
      const paymentReq = {
        body: {
          packageId: req.body.packageId,
          guestCount: req.body.guestCount,
          travelDate: req.body.travelDate,
          returnDate: req.body.returnDate,
          guestDetails: req.body.guestDetails,
          emergencyContact: req.body.emergencyContact,
          specialRequests: req.body.specialRequests,
          userId: req.user.id,
          packageTitle: package.title,
          packagePrice: package.price,
          totalAmount: totalAmount,
          paymentOption: paymentOption,
          paymentAmount: paymentAmount,
          bookingReference: `PKG${Date.now()}`
        }
      };

      // Store booking data temporarily for payment processing
      const bookingData = {
        ...req.body,
        userId: req.user.id,
        packageTitle: package.title,
        packagePrice: package.price,
        totalAmount: totalAmount,
        advanceAmount: paymentOption === 'advance' ? paymentAmount : 0,
        remainingAmount: paymentOption === 'advance' ? (totalAmount - paymentAmount) : 0,
        bookingReference: `PKG${Date.now()}`
      };

      // Store in global sessions for payment processing
      global.paymentSessions = global.paymentSessions || {};
      const sessionId = `pkg_${Date.now()}_${req.user.id}`;
      global.paymentSessions[sessionId] = bookingData;

      // Initialize payment
      const paymentResponse = await initializePayment(paymentReq, res);
      return; // Response is already sent by initializePayment
    }

    // Direct booking without payment (if needed)
    const bookingData = {
      ...req.body,
      userId: req.user.id,
      packageTitle: package.title,
      packagePrice: package.price,
      totalAmount: totalAmount,
      bookingStatus: 'Pending',
      paymentStatus: 'Pending'
    };

    const newBooking = new PackageOrder(bookingData);
    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Package booked successfully",
      data: newBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error booking package",
      error: error.message
    });
  }
};

// Get user's package bookings
const getUserPackageBookings = async (req, res) => {
  try {
    const bookings = await PackageOrder.find({ userId: req.user.id })
      .populate('packageId', 'title images destination')
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

// Get all package bookings (Admin only)
const getAllPackageBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      search
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { packageTitle: { $regex: search, $options: 'i' } },
        { bookingReference: { $regex: search, $options: 'i' } },
        { 'guestDetails.name': { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await PackageOrder.find(query)
      .populate('packageId', 'title images destination')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await PackageOrder.countDocuments(query);

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

    const booking = await PackageOrder.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes) updateData.notes = notes;

    const updatedBooking = await PackageOrder.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('packageId', 'title images destination')
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

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  getFeaturedPackages,
  getPackageCategories,
  bookPackage,
  getUserPackageBookings,
  getAllPackageBookings,
  updateBookingStatus
};
