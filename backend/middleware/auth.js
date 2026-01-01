const jwt = require("jsonwebtoken");

const protectDriver = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret123"
    );

    if (decoded.role !== "DRIVER") {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { protectDriver };
