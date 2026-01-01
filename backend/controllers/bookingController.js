const db = require("../db");

/* ===============================
   HELPER: MAP DB → FRONTEND
================================ */
const mapBooking = (row) => ({
  id: row.id,
  fullName: row.fullName,
  phone: row.phone,
  pickupCounty: row.pickupCounty,
  pickupArea: row.pickupArea,
  pickupLandmark: row.pickupLandmark,
  destinationCounty: row.destinationCounty,
  destinationArea: row.destinationArea,
  passengers: row.passengers,
  date: row.date,
  pickupTime: row.pickupTime,
  status: row.status,
  createdAt: row.createdAt,
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
        "fullName",
        phone,
        "pickupCounty",
        "pickupArea",
        "pickupLandmark",
        "destinationCounty",
        "destinationArea",
        passengers,
        date,
        "pickupTime",
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

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET ALL BOOKINGS
================================ */
const getBookings = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM bookings ORDER BY "createdAt" DESC`
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
  try {
    const result = await db.query(
      `SELECT * FROM bookings WHERE phone = $1 ORDER BY "createdAt" DESC`,
      [req.params.phone]
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
  const { status } = req.body;
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = mapBooking(result.rows[0]);

    if (global.io) {
      global.io.emit("booking-updated", booking);
    }

    res.json({ message: "Booking updated", booking });
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
