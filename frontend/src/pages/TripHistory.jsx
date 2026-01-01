import { useState } from "react";
import "./TripHistory.css";

const API_URL = import.meta.env.VITE_API_URL;

function TripHistory() {
  const [phone, setPhone] = useState("");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const fetchTrips = async () => {
    if (!phone) {
      setError("Please enter your phone number");
      return;
    }

    setLoading(true);
    setSearched(true);
    setError("");
    setTrips([]);

    try {
      const res = await fetch(
        `${API_URL}/api/bookings/by-phone/${phone}`
      );

      if (!res.ok) {
        throw new Error("No trips found");
      }

      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No trip history found for this number");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-history-container">
      <h2 className="trip-title">📜 My Trip History</h2>

      <div className="search-box">
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button onClick={fetchTrips} disabled={loading}>
          {loading ? "Checking..." : "View My Trips"}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="loading-text">Loading trips...</p>}

      {!loading && searched && trips.length === 0 && !error && (
        <p className="empty-text">No trips found.</p>
      )}

      <div className="trips-list">
        {trips.map((t) => (
          <div className="trip-card" key={t.id}>
            <div className="trip-status">
              <span className={`status ${t.status?.toLowerCase()}`}>
                {t.status}
              </span>
            </div>

            <p><strong>Pickup:</strong> {t.pickupArea}, {t.pickupCounty}</p>
            <p><strong>Destination:</strong> {t.destinationArea}, {t.destinationCounty}</p>
            <p><strong>Date:</strong> {t.date}</p>
            <p><strong>Time:</strong> {t.pickupTime}</p>
            <p><strong>Passengers:</strong> {t.passengers}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripHistory;
