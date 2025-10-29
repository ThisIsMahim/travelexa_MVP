const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const packagesController = require("../Controllers/packagesController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public routes
router.get("/", packagesController.getAllPackages);
router.get("/featured", packagesController.getFeaturedPackages);
router.get("/categories", packagesController.getPackageCategories);
router.get("/:id", packagesController.getPackageById);

// Protected routes (require authentication)
router.use(authMiddleware);

// User booking routes
router.post("/book", [
  body('packageId').notEmpty().withMessage('Package ID is required'),
  body('guestCount').isInt({ min: 1 }).withMessage('Guest count must be at least 1'),
  body('travelDate').isISO8601().withMessage('Valid travel date is required'),
  body('guestDetails').isArray({ min: 1 }).withMessage('At least one guest detail is required'),
  body('guestDetails.*.name').notEmpty().withMessage('Guest name is required'),
  body('guestDetails.*.age').isInt({ min: 1 }).withMessage('Valid age is required'),
  body('guestDetails.*.gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
  body('guestDetails.*.phone').notEmpty().withMessage('Guest phone is required'),
  body('guestDetails.*.email').isEmail().withMessage('Valid email is required'),
  body('emergencyContact.name').notEmpty().withMessage('Emergency contact name is required'),
  body('emergencyContact.phone').notEmpty().withMessage('Emergency contact phone is required'),
  body('emergencyContact.relationship').notEmpty().withMessage('Emergency contact relationship is required'),
], packagesController.bookPackage);

router.get("/bookings/my", packagesController.getUserPackageBookings);

// Admin routes (require admin authentication)
router.post("/", [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('shortDescription').notEmpty().withMessage('Short description is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('price').isNumeric().withMessage('Valid price is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('category').isIn(['Adventure', 'Beach', 'Mountain', 'Cultural', 'City', 'Wildlife', 'Religious', 'Honeymoon', 'Family', 'Solo']).withMessage('Valid category is required'),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']).withMessage('Valid difficulty is required'),
  body('maxGuests').isInt({ min: 1 }).withMessage('Max guests must be at least 1'),
  body('minGuests').isInt({ min: 1 }).withMessage('Min guests must be at least 1'),
  body('includes').isArray({ min: 1 }).withMessage('At least one inclusion is required'),
  body('itinerary').isArray({ min: 1 }).withMessage('At least one itinerary day is required'),
  body('itinerary.*.day').isInt({ min: 1 }).withMessage('Valid day number is required'),
  body('itinerary.*.title').notEmpty().withMessage('Itinerary day title is required'),
  body('itinerary.*.description').notEmpty().withMessage('Itinerary day description is required'),
  body('itinerary.*.activities').isArray({ min: 1 }).withMessage('At least one activity per day is required'),
  body('highlights').isArray({ min: 1 }).withMessage('At least one highlight is required'),
  body('bestTimeToVisit').notEmpty().withMessage('Best time to visit is required'),
  body('cancellationPolicy').notEmpty().withMessage('Cancellation policy is required'),
], packagesController.createPackage);

router.put("/:id", [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('shortDescription').optional().notEmpty().withMessage('Short description cannot be empty'),
  body('destination').optional().notEmpty().withMessage('Destination cannot be empty'),
  body('duration').optional().notEmpty().withMessage('Duration cannot be empty'),
  body('price').optional().isNumeric().withMessage('Valid price is required'),
  body('category').optional().isIn(['Adventure', 'Beach', 'Mountain', 'Cultural', 'City', 'Wildlife', 'Religious', 'Honeymoon', 'Family', 'Solo']).withMessage('Valid category is required'),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('Valid difficulty is required'),
  body('maxGuests').optional().isInt({ min: 1 }).withMessage('Max guests must be at least 1'),
  body('minGuests').optional().isInt({ min: 1 }).withMessage('Min guests must be at least 1'),
], packagesController.updatePackage);

router.delete("/:id", packagesController.deletePackage);

// Admin booking management routes
router.get("/admin/bookings", packagesController.getAllPackageBookings);
router.put("/admin/bookings/:id", packagesController.updateBookingStatus);

module.exports = router;
