const express = require("express");
const router = express.Router();

const {
  loginDriver,
  registerDriver
} = require("../controllers/driver.controller");

// 🚗 DRIVER REGISTER
router.post("/register", registerDriver);

// 🔐 DRIVER LOGIN
router.post("/login", loginDriver);

module.exports = router;
