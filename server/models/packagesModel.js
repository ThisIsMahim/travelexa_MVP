const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true, // e.g., "3 Days 2 Nights"
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: false, // For showing discount
    },
    images: [{
      type: String,
      required: true,
    }],
    category: {
      type: String,
      required: true,
      enum: ['Adventure', 'Beach', 'Mountain', 'Cultural', 'City', 'Wildlife', 'Religious', 'Honeymoon', 'Family', 'Solo']
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard']
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    minGuests: {
      type: Number,
      required: true,
      default: 1,
    },
    includes: [{
      type: String,
      required: true,
    }],
    excludes: [{
      type: String,
      required: false,
    }],
    itinerary: [{
      day: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      activities: [{
        type: String,
        required: true,
      }],
    }],
    highlights: [{
      type: String,
      required: true,
    }],
    bestTimeToVisit: {
      type: String,
      required: true,
    },
    cancellationPolicy: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("packages", packageSchema);
