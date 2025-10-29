const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const houseboatController = require("../Controllers/houseboatController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public routes
router.get("/", houseboatController.getAllHouseboats);
router.get("/featured", houseboatController.getFeaturedHouseboats);
router.get("/:id", houseboatController.getHouseboatById);

// Protected routes (require authentication)
router.use(authMiddleware);

// User booking routes
router.post("/book", [
  body('houseboatId').notEmpty().withMessage('Houseboat ID is required'),
  body('bookingReference').notEmpty().withMessage('Booking reference is required'),
  body('selectedItems').isArray({ min: 1 }).withMessage('At least one item must be selected'),
  body('selectedItems.*.itemId').notEmpty().withMessage('Item ID is required'),
  body('selectedItems.*.itemType').isIn(['cabin', 'lounge', 'restricted']).withMessage('Valid item type is required'),
  body('selectedItems.*.label').notEmpty().withMessage('Item label is required'),
  body('selectedItems.*.deckId').notEmpty().withMessage('Deck ID is required'),
  body('selectedItems.*.price').isNumeric().withMessage('Valid price is required'),
  body('selectedItems.*.capacity').isInt({ min: 1 }).withMessage('Valid capacity is required'),
  body('checkInDate').isISO8601().withMessage('Valid check-in date is required'),
  body('checkOutDate').isISO8601().withMessage('Valid check-out date is required'),
  body('guestCount').isInt({ min: 1 }).withMessage('Guest count must be at least 1'),
  body('guestDetails').isArray({ min: 1 }).withMessage('At least one guest detail is required'),
  body('guestDetails.*.name').notEmpty().withMessage('Guest name is required'),
  body('guestDetails.*.age').isInt({ min: 1 }).withMessage('Valid age is required'),
  body('guestDetails.*.gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
  body('guestDetails.*.phone').notEmpty().withMessage('Guest phone is required'),
  body('guestDetails.*.email').isEmail().withMessage('Valid email is required'),
  body('emergencyContact.name').notEmpty().withMessage('Emergency contact name is required'),
  body('emergencyContact.phone').notEmpty().withMessage('Emergency contact phone is required'),
  body('emergencyContact.relationship').notEmpty().withMessage('Emergency contact relationship is required'),
], houseboatController.bookHouseboat);

// Payment initialization route
router.post("/initialize-payment", [
  body('houseboatId').notEmpty().withMessage('Houseboat ID is required'),
  body('bookingReference').notEmpty().withMessage('Booking reference is required'),
  body('selectedItems').isArray({ min: 1 }).withMessage('At least one item must be selected'),
  body('selectedItems.*.itemId').notEmpty().withMessage('Item ID is required'),
  body('selectedItems.*.itemType').isIn(['cabin', 'lounge', 'restricted']).withMessage('Valid item type is required'),
  body('selectedItems.*.label').notEmpty().withMessage('Item label is required'),
  body('selectedItems.*.deckId').notEmpty().withMessage('Deck ID is required'),
  body('selectedItems.*.price').isNumeric().withMessage('Valid price is required'),
  body('selectedItems.*.capacity').isInt({ min: 1 }).withMessage('Valid capacity is required'),
  body('checkInDate').isISO8601().withMessage('Valid check-in date is required'),
  body('checkOutDate').isISO8601().withMessage('Valid check-out date is required'),
  body('guestCount').isInt({ min: 1 }).withMessage('Guest count must be at least 1'),
  body('guestDetails').isArray({ min: 1 }).withMessage('At least one guest detail is required'),
  body('guestDetails.*.name').notEmpty().withMessage('Guest name is required'),
  body('guestDetails.*.age').isInt({ min: 1 }).withMessage('Valid age is required'),
  body('guestDetails.*.gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
  body('guestDetails.*.phone').notEmpty().withMessage('Guest phone is required'),
  body('guestDetails.*.email').isEmail().withMessage('Valid email is required'),
  body('emergencyContact.name').notEmpty().withMessage('Emergency contact name is required'),
  body('emergencyContact.phone').notEmpty().withMessage('Emergency contact phone is required'),
  body('emergencyContact.relationship').notEmpty().withMessage('Emergency contact relationship is required'),
], houseboatController.initializeHouseboatPayment);

router.get("/bookings/my", houseboatController.getUserHouseboatBookings);

// Payment IPN route for houseboats
router.post("/payment/ipn", houseboatController.houseboatPaymentIPN);

// Admin routes (require admin authentication)
router.post("/", [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('shortDescription').notEmpty().withMessage('Short description is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Valid capacity is required'),
  body('price').isNumeric().withMessage('Valid price is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('deckPlans').isObject().withMessage('Deck plans are required'),
], houseboatController.createHouseboat);

router.put("/:id", [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('shortDescription').optional().notEmpty().withMessage('Short description cannot be empty'),
  body('location').optional().notEmpty().withMessage('Location cannot be empty'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Valid capacity is required'),
  body('price').optional().isNumeric().withMessage('Valid price is required'),
], houseboatController.updateHouseboat);

router.delete("/:id", houseboatController.deleteHouseboat);

// Admin booking management routes
router.get("/admin/bookings", houseboatController.getAllHouseboatBookings);
router.put("/admin/bookings/:id", houseboatController.updateBookingStatus);

module.exports = router;







