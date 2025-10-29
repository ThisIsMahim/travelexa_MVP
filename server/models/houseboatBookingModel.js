const mongoose = require("mongoose");

const houseboatBookingSchema = new mongoose.Schema({
  houseboat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "houseboats",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  selectedItems: [{
    itemId: {
      type: String,
      required: true
    },
    itemType: {
      type: String,
      enum: ['cabin', 'lounge', 'restricted'],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    deckId: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  advanceAmount: {
    type: Number,
    required: true
  },
  remainingAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'advance_paid', 'fully_paid', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'SSLCommerz'
  },
  transactionId: {
    type: String
  },
  advanceTransactionId: {
    type: String
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'pending'
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  guestCount: {
    type: Number,
    required: true,
    min: 1
  },
  guestDetails: [{
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  }],
  emergencyContact: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      required: true
    }
  },
  specialRequests: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("houseboatBookings", houseboatBookingSchema);







