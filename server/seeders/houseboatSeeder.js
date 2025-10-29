const mongoose = require('mongoose');
const Houseboat = require('../models/houseboatModel');
require('dotenv').config();

const houseboatData = {
  name: "Houseboat Serenity",
  description: "Experience luxury and tranquility on our premium houseboat. Featuring multiple decks with spacious cabins, elegant lounges, and breathtaking views of the water. Perfect for romantic getaways, family vacations, or corporate retreats.",
  shortDescription: "Luxury houseboat with multiple decks and premium amenities",
  location: "Sundarbans, Bangladesh",
  capacity: 20,
  price: 5000,
  images: [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ],
  amenities: [
    "Air Conditioning",
    "WiFi",
    "Private Bathrooms",
    "Mini Bar",
    "Room Service",
    "Laundry Service",
    "24/7 Security",
    "Parking"
  ],
  facilities: [
    "Restaurant",
    "Bar",
    "Spa",
    "Fitness Center",
    "Conference Room",
    "Gift Shop",
    "Tour Desk",
    "Currency Exchange"
  ],
  deckPlans: {
    "boat": {
      "id": "HB001",
      "name": "Houseboat Serenity",
      "viewBox": "0 0 1000 600"
    },
    "decks": [
      {
        "deck_id": "BRIDGE",
        "deck_name": "Bridge Deck",
        "outline": { "x": 60, "y": 30, "width": 880, "height": 140, "rx": 28 },
        "items": [
          {"id":"BR-C01","kind":"cabin","label":"Bridge Cabin 01","x":120,"y":50,"width":140,"height":80,"price":1500,"capacity":2,"status":"available"},
          {"id":"BR-C02","kind":"cabin","label":"Bridge Cabin 02","x":300,"y":50,"width":140,"height":80,"price":1800,"capacity":3,"status":"booked"},
          {"id":"BR-LG1","kind":"lounge","label":"Bridge Lounge","cx":740,"cy":100,"r":36,"price":0,"capacity":8,"status":"available"}
        ]
      },
      {
        "deck_id": "MAIN",
        "deck_name": "Main Deck",
        "outline": { "x": 60, "y": 190, "width": 880, "height": 220, "rx": 28 },
        "items": [
          {"id":"MD-C01","kind":"cabin","label":"Main Cabin 01","x":140,"y":220,"width":160,"height":90,"price":1200,"capacity":2,"status":"available"},
          {"id":"MD-C02","kind":"cabin","label":"Main Cabin 02","x":340,"y":220,"width":160,"height":90,"price":1600,"capacity":3,"status":"held"},
          {"id":"MD-C03","kind":"cabin","label":"Main Cabin 03","x":540,"y":220,"width":160,"height":90,"price":1400,"capacity":2,"status":"available"},
          {"id":"MD-L1","kind":"lounge","label":"Central Lounge","cx":820,"cy":320,"r":44,"price":80,"capacity":6,"status":"available"}
        ]
      },
      {
        "deck_id": "BOTTOM",
        "deck_name": "Bottom Deck",
        "outline": { "x":60,"y":430,"width":880,"height":120,"rx":28 },
        "items": [
          {"id":"BT-G01","kind":"cabin","label":"Lower Cabin G01","x":120,"y":450,"width":140,"height":72,"price":1000,"capacity":1,"status":"available"},
          {"id":"BT-G02","kind":"cabin","label":"Lower Cabin G02","x":300,"y":450,"width":140,"height":72,"price":1000,"capacity":1,"status":"booked"},
          {"id":"BT-ENG","kind":"restricted","label":"Engine Room","x":520,"y":450,"width":260,"height":72,"price":0,"capacity":0,"status":"not_bookable"}
        ]
      }
    ]
  },
  isActive: true,
  isFeatured: true,
  createdBy: "000000000000000000000000" // Dummy ObjectId for seeding
};

const seedHouseboat = async () => {
  try {
    // Connect to MongoDB
    const atlasUrl = "mongodb+srv://flutterstarter2024_db_user:akashloveskiddo@cluster0.axsin9s.mongodb.net/easy-booking?retryWrites=true&w=majority";
    await mongoose.connect(atlasUrl);
    console.log('Connected to MongoDB');

    // Clear existing houseboats
    await Houseboat.deleteMany({});
    console.log('Cleared existing houseboats');

    // Create new houseboat
    const houseboat = new Houseboat(houseboatData);
    await houseboat.save();
    console.log('Houseboat seeded successfully:', houseboat.name);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding houseboat:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedHouseboat();
}

module.exports = seedHouseboat;
