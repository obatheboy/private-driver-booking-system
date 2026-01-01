const db = require("../db");

/* ===============================
   HELPER: MAP DB → FRONTEND
================================ */
const mapBooking = (row) => ({
  id: row.id,
  fullName: row.full_name,
  phone: row.phone,
  pickupCounty: row.pickup_county,
  pickupArea: row.pickup_area,
  pickupLandmark: row.pickup_landmark,
  destinationCounty: row.destination_county,
  destinationArea: row.destination_area,
  passengers: row.passengers,
  date: row.date,
  pickupTime: row.pickup_time,
  status: row.status,
  createdAt: row.created_at,
});

/* ===============================
   CREATE BOOKING
================================ */
const createBooking = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      pickupCounty,
      pickupArea,
      pickupLandmark,
      destinationCounty,
      destinationArea,
      passengers,
      date,
      pickupTime,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !pickupCounty ||
      !pickupArea ||
      !destinationCounty ||
      !destinationArea ||
      !date ||
      !pickupTime
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await db.query(
      `
      INSERT INTO bookings (
        full_name,
        phone,
        pickup_county,
        pickup_area,
        pickup_landmark,
        destination_county,
        destination_area,
        passengers,
        date,
        pickup_time,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'PENDING')
      RETURNING *
      `,
      [
        fullName,
        phone,
        pickupCounty,
        pickupArea,
        pickupLandmark || null,
        destinationCounty,
        destinationArea,
        Number(passengers || 1),
        date,
        pickupTime,
      ]
    );

    const booking = mapBooking(result.rows[0]);

    if (global.io) {
      global.io.emit("new-booking", booking);
    }

    res.status(201).json({
      message: "Booking created",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET ALL BOOKINGS (DRIVER)
================================ */
const getBookings = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM bookings ORDER BY created_at DESC"
    );

    res.json(result.rows.map(mapBooking));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET BOOKINGS BY PHONE
================================ */
const getBookingsByPhone = async (req, res) => {
  const { phone } = req.params;

  if (!phone) {
    return res.status(400).json({ message: "Phone number required" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM bookings WHERE phone = $1 ORDER BY created_at DESC",
      [phone]
    );

    res.json(result.rows.map(mapBooking));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   UPDATE BOOKING STATUS
================================ */
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const ALLOWED = ["ACCEPTED", "REJECTED", "COMPLETED"];
  if (!ALLOWED.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const result = await db.query(
      `
      UPDATE bookings
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = mapBooking(result.rows[0]);

    if (global.io) {
      global.io.emit("booking-updated", booking);
    }

    res.json({
      message: "Booking updated",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingsByPhone,
  updateBookingStatus,
};
