// Load environment variables FIRST
require("dotenv").config();

const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");
const User = require("../models/usersModel");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const moment = require("moment");

// nodemailer transporter
let transporter = null;

// Only create transporter if email credentials are provided
if (process.env.EMAIL && process.env.PASSWORD) {
  transporter = nodemailer.createTransport({
    host: "mail.softenginelab.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
} else {
  console.log("Email credentials not configured. Email functionality disabled.");
}

// book seat and send email to user with the booking details (called after successful payment)
const BookSeat = async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body, // spread operator to get all the data from the request body
      user: req.params.userId,
      paymentStatus: 'completed'
    });
    const user = await User.findById(req.params.userId);
    await newBooking.save();
    const bus = await Bus.findById(req.body.bus); // get the bus from the request body
    bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats]; // add the booked seats to the bus seatsBooked array in the database

    await bus.save();
    // send email to user with the booking details
    let mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Booking Confirmation - Easy Booking",
      text: `Hello ${user.name}, your booking has been confirmed!

Booking Details:
- Bus: ${bus.name}
- Seats: ${req.body.seats.join(', ')}
- From: ${bus.from}
- To: ${bus.to}
- Departure Time: ${moment(bus.departure, "HH:mm:ss").format("hh:mm A")}
- Arrival Time: ${moment(bus.arrival, "HH:mm:ss").format("hh:mm A")}
- Journey Date: ${bus.journeyDate}
- Total Price: ${bus.price * req.body.seats.length} BDT
- Transaction ID: ${req.body.transactionId || 'N/A'}

Thank you for choosing Easy Booking! 
      `,
    };
    if (transporter) {
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          console.log("Error sending email:", err);
        } else {
          console.log("Booking confirmation email sent successfully!");
        }
      });
    } else {
      console.log("Email service not configured. Booking confirmation email not sent.");
    }
    res.status(200).send({
      message: "Seat booked successfully",
      data: newBooking,
      user: user._id,
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Booking failed",
      data: error,
      success: false,
    });
  }
};

const GetAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("bus").populate("user");
    res.status(200).send({
      message: "All bookings",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to get bookings",
      data: error,
      success: false,
    });
  }
};

const GetAllBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.user_Id }).populate([
      "bus",
      "user",
    ]);
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
};

// cancel booking by id and remove the seats from the bus seatsBooked array
const CancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.booking_id);
    const user = await User.findById(req.params.user_id);
    const bus = await Bus.findById(req.params.bus_id);
    if (!booking || !user || !bus) {
      res.status(404).send({
        message: "Booking not found",
        data: error,
        success: false,
      });
    }

    booking.remove();
    bus.seatsBooked = bus.seatsBooked.filter(
      (seat) => !booking.seats.includes(seat)
    );
    await bus.save();
    res.status(200).send({
      message: "Booking cancelled successfully",
      data: booking,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking cancellation failed",
      data: error,
      success: false,
    });
  }
};

// Update booking status
const UpdateBooking = async (req, res) => {
  try {
    const { bookingStatus, paymentStatus, notes } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Update booking fields
    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (notes !== undefined) booking.notes = notes;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: error.message
    });
  }
};

module.exports = {
  BookSeat,
  GetAllBookings,
  GetAllBookingsByUser,
  CancelBooking,
  UpdateBooking,
};
