const jwt = require("jsonwebtoken");

// 🔐 TEMP FAKE DRIVER (DEV ONLY)
const FAKE_DRIVER = {
  id: 1,
  email: "driver@test.com",
  password: "123456",
};

const loginDriver = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // Check fake credentials
  if (
    email !== FAKE_DRIVER.email ||
    password !== FAKE_DRIVER.password
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate token
  const token = jwt.sign(
    { id: FAKE_DRIVER.id, role: "driver" },
    process.env.JWT_SECRET || "dev_secret_key",
    { expiresIn: "7d" }
  );

  res.json({
    message: "Login successful",
    token,
  });
};

module.exports = { loginDriver };
