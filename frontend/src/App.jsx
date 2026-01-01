import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Booking from "./pages/Booking";
import TripHistory from "./pages/TripHistory";
import DriverDashboard from "./pages/DriverDashboard";
import DriverLogin from "./pages/DriverLogin";

// Auth
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* =====================
          PUBLIC ROUTES
      ====================== */}
      <Route path="/" element={<Landing />} />
      <Route path="/book" element={<Booking />} />

      {/* =====================
          DRIVER AUTH
      ====================== */}
      <Route path="/driver/login" element={<DriverLogin />} />

      {/* =====================
          PROTECTED DRIVER AREA
      ====================== */}
      <Route
        path="/driver"
        element={
          <ProtectedRoute>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />

      {/* Dashboard alias (nice UX) */}
      <Route path="/dashboard" element={<Navigate to="/driver" replace />} />

      {/* =====================
          PROTECTED CLIENT TRIPS
      ====================== */}
      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <TripHistory />
          </ProtectedRoute>
        }
      />

      {/* =====================
          FALLBACK
      ====================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
