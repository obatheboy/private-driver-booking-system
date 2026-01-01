const jwt = require("jsonwebtoken");

// 🔐 FAKE DRIVER (TEMP – NO DATABASE YET)
const FAKE_DRIVER = {
  email: "driver@test.com",
  password: "123456",
  id: 1,
  name: "Test Driver",
};

const loginDriver = (req, res) => {
  const { email, password } = req.body;

  // ❌ Missing fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // ❌ Invalid credentials
  if (
    email !== FAKE_DRIVER.email ||
    password !== FAKE_DRIVER.password
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ✅ Generate token
  const token = jwt.sign(
    { id: FAKE_DRIVER.id, role: "driver" },
    "dev_secret_key", // TEMP SECRET
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token,
    driver: {
      id: FAKE_DRIVER.id,
      name: FAKE_DRIVER.name,
      email: FAKE_DRIVER.email,
    },
  });
};

module.exports = { loginDriver };
