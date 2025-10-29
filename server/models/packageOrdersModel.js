const mongoose = require("mongoose");

const packageOrderSchema = new mongoose.Schema(
  {
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "packages",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    packageTitle: {
      type: String,
      required: true,
    },
    packagePrice: {
      type: Number,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: false,
    },
    guestDetails: [{
      name: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      idNumber: {
        type: String,
        required: false,
      },
    }],
    emergencyContact: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      relationship: {
        type: String,
        required: true,
      },
    },
    specialRequests: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Advance_Paid'],
      default: 'Pending',
    },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Booked', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    paymentId: {
      type: String,
      required: false,
    },
    transactionId: {
      type: String,
      required: false,
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
    paymentMethod: {
      type: String,
      default: 'SSLCommerz',
    },
    bookingReference: {
      type: String,
      required: true,
      unique: true,
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

// Generate booking reference before saving
packageOrderSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    const count = await this.constructor.countDocuments();
    this.bookingReference = `PKG${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model("packageOrders", packageOrderSchema);
