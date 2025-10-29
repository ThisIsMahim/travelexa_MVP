const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  boatNumber: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  journeyDate: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    default: 33, // Standard boat capacity
  },
  price: {
    type: Number,
    required: true,
  },
  seatsBooked: {
    type: Array,
    default: [],
  },
  status: {
    type: String,
    default: "Yet to start",
  },
  boatType: {
    type: String,
    default: "Passenger Boat",
  },
  amenities: [{
    type: String
  }],
  description: {
    type: String
  },
  rooms: [
    {
      seatNumber: { type: Number, required: true },
      roomName: { type: String, default: "" },
      imageUrl: { type: String, default: "" }
    }
  ]
});

module.exports = mongoose.model("buses", busSchema);
