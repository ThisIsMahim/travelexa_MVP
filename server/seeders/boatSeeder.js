const mongoose = require('mongoose');
const Bus = require('../models/busModel');
require('dotenv').config();

const boatData = [
  {
    name: "এমভি সুন্দরবন এম-৩০৮৮৫",
    boatNumber: "M-30885",
    from: "Munshiganj",
    to: "Sundarbans",
    departureTime: "06:00 AM",
    arrivalTime: "12:00 PM",
    journeyDate: "2025-09-15",
    capacity: 33,
    price: 1500,
    seatsBooked: [3, 7, 15, 22],
    status: "Yet to start",
    boatType: "Tourist Boat",
    amenities: ["Air Conditioning", "Refreshments", "Life Jackets", "First Aid", "Guide Service"],
    description: "Tourist boat for Sundarbans exploration with guide service from Munshiganj"
  },
  {
    name: "এমভি মেঘনা এম-৩০৮৮৭",
    boatNumber: "M-30887",
    from: "Munshiganj",
    to: "Sundarbans",
    departureTime: "02:00 PM",
    arrivalTime: "08:00 PM",
    journeyDate: "2025-09-15",
    capacity: 33,
    price: 1500,
    seatsBooked: [2, 8, 14, 20, 26],
    status: "Yet to start",
    boatType: "Tourist Boat",
    amenities: ["Air Conditioning", "Refreshments", "Life Jackets", "First Aid", "WiFi"],
    description: "Modern tourist boat with WiFi connectivity from Munshiganj to Sundarbans"
  },
  {
    name: "এমভি পদ্মা এম-৩০৮৮৬",
    boatNumber: "M-30886",
    from: "Khulna",
    to: "Sundarbans",
    departureTime: "08:00 AM",
    arrivalTime: "11:00 AM",
    journeyDate: "2025-09-15",
    capacity: 33,
    price: 1200,
    seatsBooked: [1, 5, 12, 18, 25, 30],
    status: "Yet to start",
    boatType: "Tourist Boat",
    amenities: ["Air Conditioning", "Refreshments", "Life Jackets", "First Aid", "Guide Service"],
    description: "Comfortable tourist boat for Sundarbans exploration from Khulna"
  },
  {
    name: "এমভি কর্ণফুলী এম-৩০৮৮৮",
    boatNumber: "M-30888",
    from: "Khulna",
    to: "Sundarbans",
    departureTime: "01:00 PM",
    arrivalTime: "04:00 PM",
    journeyDate: "2025-09-15",
    capacity: 33,
    price: 1200,
    seatsBooked: [4, 9, 16, 23, 28, 32],
    status: "Yet to start",
    boatType: "Tourist Boat",
    amenities: ["Air Conditioning", "Refreshments", "Life Jackets", "First Aid", "Guide Service", "WiFi"],
    description: "Premium tourist boat for Sundarbans journey from Khulna"
  },
  {
    name: "এমভি সীনারি এম-৩০৮৮৪",
    boatNumber: "M-30884",
    from: "Munshiganj",
    to: "Sundarbans",
    departureTime: "10:00 AM",
    arrivalTime: "04:00 PM",
    journeyDate: "2025-09-16",
    capacity: 33,
    price: 1500,
    seatsBooked: [],
    status: "Yet to start",
    boatType: "Tourist Boat",
    amenities: ["Air Conditioning", "Refreshments", "Life Jackets", "First Aid", "Guide Service"],
    description: "Comfortable tourist boat with modern amenities for Sundarbans journey from Munshiganj"
  },
  {
    name: "এমভি সুন্দরবন এম-৩০৮৮৯",
    boatNumber: "M-30889",
    from: "Khulna",
    to: "Sundarbans",
    departureTime: "09:00 AM",
    arrivalTime: "12:00 PM",
    journeyDate: "2025-09-16",
    capacity: 33,
    price: 1200,
    seatsBooked: [6, 11, 17, 24, 29],
    status: "Yet to start",
    boatType: "Tourist Boat",
    amenities: ["Air Conditioning", "Refreshments", "Life Jackets", "First Aid", "Guide Service"],
    description: "Eco-friendly tourist boat for Sundarbans exploration from Khulna"
  }
];

const seedBoats = async () => {
  try {
    // Connect to MongoDB
    const atlasUrl = "mongodb+srv://flutterstarter2024_db_user:akashloveskiddo@cluster0.axsin9s.mongodb.net/easy-booking?retryWrites=true&w=majority";
    await mongoose.connect(atlasUrl);
    console.log('Connected to MongoDB');

    // Clear existing boats
    await Bus.deleteMany({});
    console.log('Cleared existing boats');

    // Create new boats
    const boats = await Bus.insertMany(boatData);
    console.log(`Seeded ${boats.length} boats successfully`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding boats:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedBoats();
}

module.exports = seedBoats;
