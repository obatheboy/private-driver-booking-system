const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* =========================
   REGISTER DRIVER (ADMIN ONLY)
========================= */
const registerDriver = async (req, res) => {
  try {
    // 🔐 ADMIN CHECK
    const adminKey = req.headers["x-admin-key"];

    if (adminKey !== process.env.ADMIN_CREATE_KEY) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { fullName, phone, password } = req.body;

    if (!fullName || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔎 Check if driver already exists
    const existing = await db.query(
      "SELECT id FROM drivers WHERE phone = $1",
      [phone]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Driver already registered" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Save driver
    const result = await db.query(
      `INSERT INTO drivers (full_name, phone, password)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, phone`,
      [fullName, phone, hashedPassword]
    );

    res.status(201).json({
      message: "Driver created successfully",
      driver: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGIN DRIVER
========================= */
const loginDriver = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const result = await db.query(
      "SELECT * FROM drivers WHERE phone = $1",
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const driver = result.rows[0];

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: driver.id, role: "driver" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      driver: {
        id: driver.id,
        fullName: driver.full_name,
        phone: driver.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerDriver,
  loginDriver,
};
