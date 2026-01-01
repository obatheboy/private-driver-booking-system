import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, getToken } from "../auth/auth";
import "./driverLogin.css";

function DriverLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ If already logged in, go to dashboard
  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate("/driver", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!phone || !password) {
      alert("Phone number and password required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/driver/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (!data.token) {
        alert("Invalid login response");
        return;
      }

      setToken(data.token);
      navigate("/driver", { replace: true });
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="driver-login-page">
      <div className="driver-login-card">
        <h2>🚗 Driver Login</h2>

        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "LOGIN"}
        </button>
      </div>
    </div>
  );
}

export default DriverLogin;
