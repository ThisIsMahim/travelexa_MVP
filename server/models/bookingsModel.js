const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "buses",
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },
    seats: {
      type: Array,
      require: true,
    },
    transactionId: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Booked', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      default: 'SSLCommerz',
    },
    advanceAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
    },
    advanceTransactionId: {
      type: String,
      required: false,
    },
    finalTransactionId: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("bookings", bookingSchema);
