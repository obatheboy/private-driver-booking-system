import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { getToken, logout } from "../auth/auth";
import "./driverDashboard.css";

function DriverDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [activeTab, setActiveTab] = useState("PENDING");
  const navigate = useNavigate();

  /* 🔊 SOUND REF */
  const notificationSound = useRef(null);

  /* 🔔 REQUEST NOTIFICATION PERMISSION */
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  /* 📦 LOAD BOOKINGS */
  const loadBookings = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to load bookings");

      const data = await res.json();

      // ✅ SAFETY: always force array
      setBookings(Array.isArray(data) ? data : data.bookings || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  /* 🔌 SOCKET + INITIAL LOAD */
  useEffect(() => {
    loadBookings();

    socket.on("new-booking", (booking) => {
      setBookings((prev) => [booking, ...prev]);
      setNotification("🔔 New booking received!");

      /* 🔊 SOUND */
      notificationSound.current?.play().catch(() => {});

      /* 📱 VIBRATE */
      navigator.vibrate?.([300, 150, 300]);

      /* 🔔 SYSTEM NOTIFICATION */
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🚗 New Booking", {
          body: `${booking.fullName} • ${booking.pickupArea}, ${booking.pickupCounty} → ${booking.destinationArea}, ${booking.destinationCounty}`,
        });
      }

      setTimeout(() => setNotification(""), 4000);
    });

    socket.on("booking-updated", (updatedBooking) => {
      setBookings((prev) =>
        prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
      );
    });

    return () => {
      socket.off("new-booking");
      socket.off("booking-updated");
    };
  }, []);

  /* 🔁 UPDATE STATUS */
  const updateStatus = async (id, status) => {
    if (!window.confirm(`Mark booking as ${status}?`)) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update");
        return;
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? data.booking : b))
      );
    } catch {
      alert("Server error");
    }
  };

  /* 🚪 LOGOUT */
  const handleLogout = () => {
    logout();
    navigate("/driver/login");
  };

  if (loading) {
    return <p className="dashboard-loading">Loading bookings...</p>;
  }

  /* 🧹 FILTER */
  const filteredBookings = bookings.filter((b) =>
    activeTab === "PENDING" ? b.status === "PENDING" : b.status !== "PENDING"
  );

  return (
    <div className="driver-dashboard">
      {/* 🔊 AUDIO */}
      <audio ref={notificationSound} src="/notification.mp3" preload="auto" />

      <div className="dashboard-header">
        <h2>🚗 Driver Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {notification && (
        <div className="dashboard-notification">{notification}</div>
      )}

      <div className="dashboard-tabs">
        <button
          className={activeTab === "PENDING" ? "active" : ""}
          onClick={() => setActiveTab("PENDING")}
        >
          Pending Requests
        </button>
        <button
          className={activeTab === "HISTORY" ? "active" : ""}
          onClick={() => setActiveTab("HISTORY")}
        >
          Trip History
        </button>
      </div>

      {filteredBookings.length === 0 && (
        <p className="no-bookings">No records found.</p>
      )}

      <div className="bookings-list">
        {filteredBookings.map((b) => {
          const whatsappMessage = encodeURIComponent(
            `Hello ${b.fullName}, this is your driver 🚗.\nPickup: ${b.pickupArea}, ${b.pickupCounty}\nDestination: ${b.destinationArea}, ${b.destinationCounty}`
          );

          return (
            <div key={b.id} className="booking-card">
              <div className={`status-badge ${b.status.toLowerCase()}`}>
                {b.status}
              </div>

              <p><strong>Name:</strong> {b.fullName}</p>
              <p><strong>Phone:</strong> {b.phone}</p>

              <div className="quick-contact">
                <a
                  href={`https://wa.me/254${b.phone.slice(-9)}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn"
                >
                  WhatsApp
                </a>
                <a href={`tel:${b.phone}`} className="call-btn">
                  Call
                </a>
              </div>

              <p><strong>Pickup:</strong> {b.pickupArea}, {b.pickupCounty}</p>
              {b.pickupLandmark && (
                <p><strong>Landmark:</strong> {b.pickupLandmark}</p>
              )}
              <p><strong>Destination:</strong> {b.destinationArea}, {b.destinationCounty}</p>
              <p><strong>Passengers:</strong> {b.passengers}</p>
              <p>
                <strong>Date:</strong> {b.date}<br />
                <strong>Pickup Time:</strong> {b.pickupTime}
              </p>

              <div className="booking-actions">
                {b.status === "PENDING" && (
                  <>
                    <button
                      className="accept-btn"
                      onClick={() => updateStatus(b.id, "ACCEPTED")}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => updateStatus(b.id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </>
                )}

                {b.status === "ACCEPTED" && (
                  <button
                    className="complete-btn"
                    onClick={() => updateStatus(b.id, "COMPLETED")}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DriverDashboard;
