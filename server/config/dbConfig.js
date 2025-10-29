// Load environment variables FIRST
require("dotenv").config();

const mongoose = require("mongoose");

// Use Atlas connection string directly (bypassing environment variable issues)
const atlasUrl = "mongodb+srv://flutterstarter2024_db_user:akashloveskiddo@cluster0.axsin9s.mongodb.net/easy-booking?retryWrites=true&w=majority";

console.log("Connecting to MongoDB Atlas:", atlasUrl);
mongoose.connect(atlasUrl);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Mongo Db Connection Successful");
});

db.on("error", () => {
  console.log("Mongo Db Connection Failed");
});
