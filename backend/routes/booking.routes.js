const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookings,
  getBookingsByPhone,
  updateBookingStatus,
} = require("../controllers/bookingController");

// Customer creates booking
router.post("/", createBooking);

// Driver/Admin views all bookings
router.get("/", getBookings);

// ✅ Customer views their trip history by phone
router.get("/by-phone/:phone", getBookingsByPhone);

// Driver updates booking status
router.patch("/:id/status", updateBookingStatus);

module.exports = router;
