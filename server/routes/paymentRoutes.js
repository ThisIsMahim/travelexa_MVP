const express = require("express");
const router = express.Router();
const {
  initializePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN
} = require("../Controllers/paymentController");

// Initialize payment
router.post("/initialize", initializePayment);
router.post("/initialize-payment", initializePayment);

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Payment routes are working", success: true });
});

// Payment success callback
router.post("/success", paymentSuccess);

// Payment fail callback
router.post("/fail", paymentFail);

// Payment cancel callback
router.post("/cancel", paymentCancel);

// IPN (Instant Payment Notification)
router.post("/ipn", paymentIPN);

module.exports = router;

