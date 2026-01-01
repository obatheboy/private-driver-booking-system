const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();


const bookingRoutes = require("./routes/booking.routes");

const driverRoutes = require("./routes/driver.routes");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- HTTP SERVER ---------------- */
const server = http.createServer(app);

/* ---------------- SOCKET.IO ---------------- */
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*", // restrict later in production
  },
});

// 🔥 Make io global (controllers can emit)
global.io = io;

io.on("connection", (socket) => {
  console.log("🔌 Driver connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Driver disconnected:", socket.id);
  });
});

/* ---------------- ROUTES ---------------- */

// Health check
app.get("/", (req, res) => {
  res.send("Private Driver Booking API is running");
});

// API routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/driver", driverRoutes);

/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
