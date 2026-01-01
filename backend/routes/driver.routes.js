const express = require("express");
const router = express.Router();

const { loginDriver } = require("../controllers/driver.controller");

// 🔐 DRIVER LOGIN (FAKE AUTH FOR NOW)
router.post("/login", loginDriver);

module.exports = router;
