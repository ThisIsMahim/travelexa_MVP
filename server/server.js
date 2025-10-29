// Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const dbConfig = require("./config/dbConfig");
const bodyParser = require("body-parser");

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/buses", require("./routes/busesRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingsRoutes"));
app.use("/api/cities", require("./routes/citiesRoutes"));
app.use("/api/packages", require("./routes/packagesRoutes"));
app.use("/api/houseboats", require("./routes/houseboatRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

// listen to port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
