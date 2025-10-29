const express = require("express");
const router = express();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  BookSeat,
  GetAllBookings,
  GetAllBookingsByUser,
  CancelBooking,
  UpdateBooking,
} = require("../Controllers/bookingController");

const {
  initializePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN
} = require("../Controllers/paymentController");

router.post("/book-seat/:userId", BookSeat);
router.get("/get-all-bookings", authMiddleware, GetAllBookings);
router.get("/:user_Id", authMiddleware, GetAllBookingsByUser);
router.put("/:id", authMiddleware, UpdateBooking);
router.delete("/:booking_id/:user_id/:bus_id", authMiddleware, CancelBooking);
// Payment routes
router.post("/initialize-payment", initializePayment);
router.post("/payment/success", paymentSuccess);
router.post("/payment/fail", paymentFail);
router.post("/payment/cancel", paymentCancel);
router.post("/payment/ipn", paymentIPN);

module.exports = router;
